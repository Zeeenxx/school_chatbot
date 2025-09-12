import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    backgroundGradient: string;
    text: string;
    primary: string;
    secondary?: string; // Adding secondary as it was used, making it optional
    cardBackground: string;
    border: string;
    shadow: string;
    // Add any other properties from your theme objects here
    chatBackground: string;
    headerBackground: string;
    messageUser: string;
    messageBot: string;
    messageUserText: string;
    messageBotText: string;
    inputBackground: string;
    inputBorder: string;
    inputText: string;
    textSecondary: string;
    buttonBackground: string;
    buttonText: string;
    buttonHover: string;
    messagesBackground: string;
    headerText: string;
    userMessageBackground: string;
    botMessageBackground: string;
    userMessageText: string;
    botMessageText: string;
    botMessageIcon: string;
    inputFieldBackground: string;
    placeholderText: string;
    primaryTransparent: string;
    buttonDisabled: string;
    hoverBackground?: string;
    dashboardBackground?: string;
    titleColor?: string;
    borderColor?: string;
  }
}
