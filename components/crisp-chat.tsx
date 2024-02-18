"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("d85eeb01-5005-4adc-9027-9cf4d0642e05");
  }, []);

  return null;
};
