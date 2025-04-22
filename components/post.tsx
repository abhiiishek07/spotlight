import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "@/styles/feed.styles";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type postProps = {
  _id: Id<"posts">;
  _creationTime: number;
  caption?: string | undefined;
  userId: Id<"users">;
  imageUrl: string;
  storageId: Id<"_storage">;
  likes: number;
  comments: number;
  author: {
    _id: Id<"users"> | undefined;
    username: string | undefined;
    image: string | undefined;
  };
  isLiked: boolean;
  isBookmarked: boolean;
};

const Post = ({ post }: { post: postProps }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCnt, setLikesCnt] = useState(post.likes);

  const toggleLike = useMutation(api.posts.toggleLike);

  const handleLike = async () => {
    try {
      const liked = await toggleLike({ postId: post._id });

      setIsLiked(liked);
      setLikesCnt((prev) => (liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.log("Error liking post", error);
    }
  };
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Link href={"/(tabs)/notifications"}>
          <TouchableOpacity style={styles.postHeaderLeft}>
            <Image
              source={post.author.image}
              style={styles.postAvatar}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
            <Text style={styles.postUsername}>{post.author.username}</Text>
          </TouchableOpacity>
        </Link>

        {/* <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
        </TouchableOpacity> */}
        <TouchableOpacity>
          <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* IMAGE */}
      <Image
        source={post.imageUrl}
        style={styles.postImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />

      {/* POST ACTIONS */}
      <View style={styles.postActions}>
        <View style={styles.postActionsLeft}>
          <TouchableOpacity onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? COLORS.primary : COLORS.white}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>{" "}
        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* POST INFO */}

      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCnt > 0
            ? `${likesCnt.toLocaleString()} likes`
            : "Be the first one to like"}
        </Text>
      </View>
    </View>
  );
};

export default Post;
