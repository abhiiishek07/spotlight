import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { styles } from "@/styles/feed.styles";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

const Post = ({ post }: { post: any }) => {
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
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color={COLORS.white} />
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
    </View>
  );
};

export default Post;
