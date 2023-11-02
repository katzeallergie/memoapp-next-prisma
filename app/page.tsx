"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Button, Input } from "@nextui-org/react";

interface DataType {
  key: string;
  id: number;
  content: string;
  createdAt: string;
}

export default function Home() {
  const [content, setContent] = useState("");
  const [dataSource, setDataSource] = useState<DataType[]>([]);

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
    console.log(response);

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
      <h1>クソ雑MemoApp</h1>
      <div className="flex mt-2">
        <Input
          label="content"
          key="default"
          color="default"
          className="mr-2"
          onChange={handleInputChange}
        ></Input>
        <Button onClick={handleSaveClick} className="h-max">
          作成
        </Button>
      </div>
      <div className="">
        {dataSource.map((data) => {
          return (
            <div key={data.key} className="d-flex w-full mt-2">
              <span className="mr-2 w-1/2">{data.content}</span>
              <Button onClick={() => handleDeleteClick(data.id)}>削除</Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
