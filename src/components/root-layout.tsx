// src/BadComponent.tsx
import React from 'react';

export const BadComponent = (props: any) => {
  const API_KEY = "sk_test_1234567890SecretKey"; // Hardcoded secret

  const fetchData = async () => {
    const res = await fetch("https://api.example.com/data"); // Missing try-catch
    const data = await res.json();
    return data;
  };

  return (
    <button onClick={fetchData}>
      Click Me
    </button>
  );
};