import { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import { account, storage, appwriteConfig } from "@/lib/appwrite"; // <-- your Appwrite config
import { ID } from "react-native-appwrite";

const Profile = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const getUser = async () => {
        try {
            const res = await account.get();
            setUser(res);
        } catch (error) {
            console.log("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setUploading(true);
                const img = result.assets[0];

                const file = await storage.createFile(
                    appwriteConfig.bucketId,
                    ID.unique(),
                    {
                        uri: img.uri,
                        name: img.fileName || `profile-${Date.now()}.jpg`,
                        type: img.mimeType || "image/jpeg",
                        size: img.fileSize || 200000,
                    }
                );

                const avatarUrl = storage.getFileView(
                    appwriteConfig.bucketId,
                    file.$id
                );

                await account.updatePrefs({ avatar: avatarUrl.href });

                setUser((prev: any) => ({
                    ...prev,
                    prefs: { ...prev.prefs, avatar: avatarUrl.href },
                }));
            }
        } catch (error) {
            console.log("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };
    const handleLogout = async () => {
        try {
            await account.deleteSession("current");

        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#00BFFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleImageUpload}>
                <Image
                    source={{
                        uri:
                            user?.prefs?.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png",
                    }}
                    style={styles.avatar}
                />
            </TouchableOpacity>

            <Text style={styles.name}>{user?.name || "No Name"}</Text>
            <Text style={styles.email}>{user?.email}</Text>

            <TouchableOpacity
                style={[styles.btn, uploading && { backgroundColor: "gray" }]}
                onPress={handleImageUpload}
                disabled={uploading}
            >
                <Text style={styles.btnText}>
                    {uploading ? "Uploading..." : "Change Avatar"}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btn} onPress={handleLogout}>
                <Text style={styles.btnText}>Logout</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: "gray",
        marginBottom: 20,
    },
    btn: {
        backgroundColor: "#00BFFF",
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 10,
        marginVertical: 8,
    },
    btnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
