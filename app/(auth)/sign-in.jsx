import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { images } from "@/constants"
import FormField from "@/components/FormField"
import { useState } from "react"
import CustomButton from "@/components/CustomButton"
import { Link, router } from "expo-router"
import { getCurrentUser, signIn } from "@/lib/appwrite"
import { useGlobalContext } from "@/context/GloabalProvider"

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext()
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all the fields")
      return
    }
    setIsSubmitting(true)
    try {
      await signIn(form.email, form.password)

      const result = await getCurrentUser();
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home")
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
          <View className='w-full justify-center px-4 my-6 min-h-[85vh]'>
            <Image
              source={images.logo}
              resizeMode='contain'
              className='w-[115px] h-[35px]'
            />
            <Text className='text-2xl text-white text-semibold mt-10 font-semibold'>
              Log in to Aora
            </Text>

            <FormField
              title='Email'
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles='mt-7'
              keyboardType='email-address'
            />

            <FormField
              title='Password'
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              otherStyles='mt-7'
            />
            <CustomButton
              title='Sign In'
              handlePress={submit}
              containerStyles='mt-7'
              isLoading={isSubmitting}
            />
            <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-lg text-gray-100 font-pregular'>
                Don't have an account?
              </Text>
              <Link
                href='/sign-up'
                className='text-lg font-psemibold text-secondary'
              >
                Sign Up
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
export default SignIn
const styles = StyleSheet.create({})
