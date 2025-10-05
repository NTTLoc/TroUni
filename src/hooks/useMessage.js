import { useContext } from "react";
import { MessageContext } from "../components/context/message.context";

const useMessage = () => {
  return useContext(MessageContext);
};

export default useMessage;
