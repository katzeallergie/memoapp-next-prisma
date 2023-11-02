"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Button, Card, Input, Table } from "@nextui-org/react";

interface DataType {
  key: string;
  id: number;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [dataSource, setDataSource] = useState("");

  useEffect(() => {
    const fetchMemos = async () => {
      const response = await fetch("/api/memos");
      const memos = await response.json();
      setDataSource(memos);
    };
    fetchMemos();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  };

  const handleSaveClick = async () => {
    const response = await fetch("/api/memos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    const memos = await response.json();
    setDataSource(memos);

    setContent("");
  };

  const handleDeleteClick = async (id: number) => {
    const response = await fetch(`/api/memos?id=${id}`, {
      method: "DELETE",
    });

    const memos = await response.json();
    setDataSource(memos);
  };

  return (
    <div className="h-screen p-5">
      MemoApp
      <Input
        label="content"
        key="default"
        color="default"
        onChange={handleInputChange}
      ></Input>
      <Button onClick={handleSaveClick}>作成</Button>
      <div>めも１</div>
      <div>めも２</div>
    </div>
  );
}
