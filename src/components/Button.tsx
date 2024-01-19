import React from "react";
import { Text, TouchableOpacity } from "react-native";

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  icon?: React.ReactElement;
  label: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  href,
  disabled,
  icon,
  label,
}) => {
  const buttonClass = `bg-white rounded-lg px-4 py-3 flex-row items-center space-x-2`;

  if (href) {
    return (
      <TouchableOpacity onPress={onClick} className={buttonClass}>
        {icon && React.cloneElement(icon)}
        <Text>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onClick}
      className={`${buttonClass} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      disabled={disabled}
    >
      {icon && React.cloneElement(icon)}
      <Text>{label}</Text>
    </TouchableOpacity>
  );
};

export default Button;
