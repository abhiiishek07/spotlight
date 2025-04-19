import { styles } from "@/styles/auth.styles";
import { Link } from "expo-router";
import { Text, View } from "react-native";

const Home = () => {
  return (
    <View style={styles.container}>
      <Link href="/notifications">
        <Text>Visit Notification screeen</Text>
      </Link>
    </View>
  );
};

export default Home;
