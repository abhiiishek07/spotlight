import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { styles } from "@/styles/feed.styles";
import { Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import CommentsModal from "./comments-modal";
import { useUser } from "@clerk/clerk-expo";

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
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setShowCommentsCount] = useState(post.comments);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  const { user } = useUser();

  const currentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );

  const toggleLike = useMutation(api.posts.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const deletePost = useMutation(api.posts.deletePost);

  const handleLike = async () => {
    try {
      const liked = await toggleLike({ postId: post._id });

      setIsLiked(liked);
      setLikesCnt((prev) => (liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.log("Error liking post", error);
    }
  };

  const handleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked);
      const bookmarkStatus = await toggleBookmark({ postId: post._id });

      if (bookmarkStatus !== !isBookmarked) {
        setIsBookmarked(isBookmarked);
      }
    } catch (error) {
      setIsBookmarked(isBookmarked);
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePost({ postId: post._id });
    } catch (error) {
      console.error("Error deleting post:", error);
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

        {post.author._id === currentUser?._id ? (
          <TouchableOpacity onPress={handleDeletePost}>
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        )}
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
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>{" "}
        <TouchableOpacity onPress={handleBookmark}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={22}
            color={COLORS.white}
          />
        </TouchableOpacity>
      </View>

      {/* POST INFO */}
      <View style={styles.postInfo}>
        <Text style={styles.likesText}>
          {likesCnt > 0
            ? `${likesCnt.toLocaleString()} likes`
            : "Be the first one to like"}
        </Text>
        {post.caption && (
          <View style={styles.captionContainer}>
            <Text style={styles.captionUsername}>{post.author.username}</Text>{" "}
            <Text style={styles.captionText}>{post.caption}</Text>
          </View>
        )}
        {commentsCount > 0 && (
          <TouchableOpacity onPress={() => setShowComments(true)}>
            <Text style={styles.commentsText}>
              View All {commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setShowCommentsCount((prev) => prev + 1)}
      />
    </View>
  );
};

export default Post;
