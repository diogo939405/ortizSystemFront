import { useContext } from "react";
import { AddBoletoContext } from "./AddBoletoContext";
export default function useAddBoletoContext() {
    return useContext(AddBoletoContext);
}