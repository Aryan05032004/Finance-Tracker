import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = async () => {
    if (!user) return;

    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/getAllByUserID/${user.id}`
      );

      if (response.ok) {
        const records = await response.json();
        console.log("Fetched records:", records);
        setRecords(records);
      } else {
        console.error("Failed to fetch records:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    if (!user) return;
    const recordWithUserId = { ...record, userId: user.id };

    try {
      const response = await fetch("http://localhost:3001/financial-records", {
        method: "POST",
        body: JSON.stringify(recordWithUserId),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
        console.log("Record added:", newRecord);
      } else {
        console.error("Failed to add record:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error adding record:", error);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    if (!user) return;
    const recordWithUserId = { ...newRecord, userId: user.id };

    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(recordWithUserId),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => (record._id === id ? updatedRecord : record))
        );
        console.log("Record updated:", updatedRecord);
      } else {
        console.error("Failed to update record:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error updating record:", error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:3001/financial-records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        const deletedRecord = await response.json();
        setRecords((prev) =>
          prev.filter((record) => record._id !== deletedRecord._id)
        );
        console.log("Record deleted:", deletedRecord);
      } else {
        console.error("Failed to delete record:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
  