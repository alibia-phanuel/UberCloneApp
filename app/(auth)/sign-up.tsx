import React from "react";
import { Alert, Text, ScrollView, View, Image } from "react-native";

import { useState } from "react";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constants";
import { Link } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { useSignUp } from "@clerk/clerk-expo";
import { ReactNativeModal } from "react-native-modal";
import InputField from "@/components/InputField";
// import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
const SingUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [showSuccesssModal, setShowSuccessModal] = useState(false);

  const router = useRouter();
  //notre formulaire
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  //Etaps de verification pars e-mail
  const [verification, setVerification] = useState({
    state: "default",
    error: "",
    code: "",
  });

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerification({
        ...verification,
        state: "pending",
      });
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.log(JSON.stringify(err, null, 2));
      Alert.alert("Error", err.errors[0].longMessage);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) return;

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code: verification.code,
      });

      if (completeSignUp.status === "complete") {
        // TODO: Create a database user!

        await setActive({ session: completeSignUp.createdSessionId });
        setVerification({ ...verification, state: "success" });
      } else {
        setVerification({
          ...verification,
          error: "Verification failed",
          state: "failed",
        });
      }
    } catch (err: any) {
      setVerification({
        ...verification,
        error: err.erros[0].longMessage,
        state: "failed",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="flex-1 bg-white">
        <View className="relative w-full h-[250px]">
          <Image
            source={require("../../assets/images/signup-car.png")}
            className="z-0 w-full h-[250px]"
          />
          <Text className="text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5">
            Créez votre compte
          </Text>
        </View>
        <View className="p-5">
          <InputField
            label="Name"
            placeholder="Saisir le nom"
            icon={icons.person}
            value={form.name}
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
          <InputField
            label="Email"
            placeholder="Saisir votre email"
            icon={icons.email}
            value={form.email}
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <InputField
            label="Mot de passe"
            placeholder="Saisir le Mot de passe"
            icon={icons.lock}
            secureTextEntry={true}
            textContentType="password"
            value={form.password}
            onChangeText={(value) => setForm({ ...form, password: value })}
          />
          <CustomButton
            title="S'inscrire"
            onPress={onSignUpPress}
            className="mt-6"
          ></CustomButton>
          <OAuth />
          <Link
            href="/sign-in"
            className="text-lg text-center text-general-200 mt-10"
          >
            <Text>Vous avez déjà un compte ?</Text>
            <Text className="text-primary-500"> Se connecter</Text>
          </Link>
        </View>
        {/**Modal de verifications pending   setVerification({ ...verification, state: "success" })*/}
        <ReactNativeModal
          isVisible={verification.state === "pending"}
          onModalHide={() => {
            if (verification.state === "success") {
              setShowSuccessModal(true);
            }
          }}
        >
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Text className="text-2xl font-JakartaExtraBold mb-2">
              Verification
            </Text>
            <Text className=" font-Jakarta mb-5">
              Nous avons envoyé un code de vérification à {form.email}
            </Text>
            <InputField
              label={"Code"}
              icon={icons.lock}
              placeholder={"12345"}
              value={verification.code}
              keyboardType="numeric"
              onChangeText={(code) =>
                setVerification({ ...verification, code })
              }
            />
            <CustomButton
              title="Vérifier l'adresse E-mail"
              onPress={onPressVerify}
              className="mt-5 bg-success-500"
            />
          </View>
        </ReactNativeModal>
        {/**Modal de verifications Success*/}
        <ReactNativeModal isVisible={showSuccesssModal}>
          <View className="bg-white px-7 py-9 rounded-2xl min-h-[300px]">
            <Image
              source={images.check}
              className="w-[110px] h-[110px] mx-auto my-5"
            ></Image>
            <Text className="text-3xl font-JakartaBold text-center">
              Vérifié
            </Text>
            <Text className="text-base text-gray-400 font-Jakarta text-center mt-2">
              Vous avez vérifié votre compte avec succès.
            </Text>
            <CustomButton
              title="allez sur l'accueil"
              onPress={() => {
                setShowSuccessModal(false);
                router.push("/(root)/(tabs)/home");
              }}
              className="mt-5"
            ></CustomButton>
          </View>
        </ReactNativeModal>
      </View>
    </ScrollView>
  );
};

export default SingUp;
