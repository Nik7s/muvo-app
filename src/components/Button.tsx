import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  icon?: React.ReactElement;
  label: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled, icon, label }) => {
  const buttonClass = `bg-white rounded-lg py-3 flex-row items-center justify-center space-x-1 mx-2`;
  return (
    <TouchableOpacity
      onPress={onClick}
      className={`${buttonClass} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      disabled={disabled}
    >
      {icon && React.cloneElement(icon)}
      <Text className="text-base font-medium text-zinc-800">{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
