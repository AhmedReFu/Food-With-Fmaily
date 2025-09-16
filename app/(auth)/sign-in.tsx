import {View, Text, Button} from 'react-native'
import {router} from "expo-router";

const SignIn = () => {
    return (
        <View>
            <Text>Sign In</Text>
            <Button title="Sign Up" onPress={()=> router.push("/sign-up")} />
        </View>
    )
}
export default SignIn
