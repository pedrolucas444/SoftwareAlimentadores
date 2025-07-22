import React, { createContext, useContext, useState } from "react";

interface DataContextType {
  alimentadorData: any;
  setAlimentadorData: (data: any) => void;
}

const defaultAlimentadorData = {
  labels: ["Posição Atual"],
  datasets: [
    {
      data: [0, 100], 
      backgroundColor: ["#00C49F", "#EAEAEA"],
    },
  ],
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [alimentadorData, setAlimentadorData] = useState(defaultAlimentadorData);

  return (
    <DataContext.Provider value={{ alimentadorData, setAlimentadorData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useDataContext must be used within a DataProvider");
  }
  return context;
};
