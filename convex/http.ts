import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("Missing CLERk_WEBHOOK_SCRET env variable");
    }

    const svix_id = req.headers.get("svix-id");
    const svix_sign = req.headers.get("svix-signature");
    const svix_timestamp = req.headers.get("svix-timestamp");

    if (!svix_id || !svix_sign || !svix_timestamp) {
      return new Response("Error - no svix header", {
        status: 400,
      });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    const wh = new Webhook(webhookSecret);
    let evt: any;

    // VERIFIYING WEBHOOK
    try {
      evt = wh.verify(body, {
        "svix-id": svix_id,
        "svix-signature": svix_sign,
        "svix-timestamp": svix_timestamp,
      }) as any;
    } catch (error) {
      console.log("Error verifying webhook", error);
      return new Response("Error occurred", { status: 400 });
    }

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name, image_url } =
        evt.data;

      console.log(
        "event",
        id,
        email_addresses[0],
        first_name,
        last_name,
        image_url
      );
      const email = email_addresses[0].email_address;
      const name = `${first_name || ""} ${last_name || ""}`.trim();

      try {
        await ctx.runMutation(api.users.createUser, {
          username: email.split("@")[0],
          fullName: name,
          email: email,
          image: image_url,
          clerkId: id,
        });
        console.log("user created succ");
      } catch (error) {
        console.log("Error creating user", error);
        return new Response("Error creating user", { status: 500 });
      }
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
