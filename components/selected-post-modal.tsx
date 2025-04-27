import { View, Text, Modal, TouchableOpacity } from "react-native";
import React from "react";

import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";
import { styles } from "@/styles/profile.styles";

const SelectedPostModal = ({ selectedPost, setSelectedPost }: any) => {
  return (
    <Modal
      visible={!!selectedPost}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setSelectedPost(null)}
    >
      <View style={styles.modalBackdrop}>
        {selectedPost && (
          <View style={styles.postDetailContainer}>
            <View style={styles.postDetailHeader}>
              <TouchableOpacity onPress={() => setSelectedPost(null)}>
                <Ionicons name="close" size={26} color={COLORS.white} />
              </TouchableOpacity>
            </View>

            <Image
              source={selectedPost}
              cachePolicy={"memory-disk"}
              style={styles.postDetailImage}
            />
          </View>
        )}
      </View>
    </Modal>
  );
};

export default SelectedPostModal;
