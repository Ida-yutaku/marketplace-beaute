import { Alert, Platform } from "react-native";

interface AlertAction {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
}

export function showAlert(title: string, message?: string, actions?: AlertAction[]) {
  if (Platform.OS === "web") {
    if (actions?.some((a) => a.style === "destructive")) {
      if (window.confirm(`${title}\n\n${message}`)) {
        actions.find((a) => a.style === "destructive")?.onPress?.();
      }
    } else {
      window.alert(message ? `${title}\n\n${message}` : title);
    }
  } else {
    Alert.alert(
      title,
      message,
      actions?.map((a) => ({ text: a.text, style: a.style, onPress: a.onPress }))
    );
  }
}

export function confirmAlert(title: string, message: string, onConfirm: () => void) {
  if (Platform.OS === "web") {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: "Annuler", style: "cancel" },
      { text: "Confirmer", style: "destructive", onPress: onConfirm },
    ]);
  }
}