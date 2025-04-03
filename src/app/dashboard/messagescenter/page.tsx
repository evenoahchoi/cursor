"use client";

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon, SendIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { format } from "date-fns";

interface MessageThread {
  id: string;
  customerName: string;
  lastMessage: string;
  lastMessageTime: Date;
  avatarUrl?: string;
  unreadCount: number;
}

interface Message {
  id: string;
  sender: 'user' | 'customer';
  text: string;
  timestamp: Date;
}

const dummyThreads: MessageThread[] = [
  { id: 'thread1', customerName: '김민준', lastMessage: '네, 확인했습니다. 감사합니다!', lastMessageTime: new Date(2024, 6, 29, 10, 30), unreadCount: 0 },
  { id: 'thread2', customerName: '이서연', lastMessage: '혹시 다음 주 일정 조정 가능할까요?', lastMessageTime: new Date(2024, 6, 28, 16, 5), unreadCount: 1, avatarUrl: '/default-avatar.png' },
  { id: 'thread3', customerName: '박지훈', lastMessage: '자료 잘 받았습니다.', lastMessageTime: new Date(2024, 6, 27, 9, 15), unreadCount: 0 },
];

const dummyMessages: { [key: string]: Message[] } = {
  thread1: [
    { id: 'msg1-1', sender: 'customer', text: '안녕하세요, 예약 관련 문의드립니다.', timestamp: new Date(2024, 6, 29, 10, 20) },
    { id: 'msg1-2', sender: 'user', text: '네, 김민준 고객님 안녕하세요. 어떤 점이 궁금하신가요?', timestamp: new Date(2024, 6, 29, 10, 22) },
    { id: 'msg1-3', sender: 'customer', text: '예약 시간 변경 가능한지 여쭤보려구요.', timestamp: new Date(2024, 6, 29, 10, 25) },
    { id: 'msg1-4', sender: 'user', text: '네, 잠시만요... 확인해보니 변경 가능합니다. 언제가 편하실까요?', timestamp: new Date(2024, 6, 29, 10, 28) },
    { id: 'msg1-5', sender: 'customer', text: '네, 확인했습니다. 감사합니다!', timestamp: new Date(2024, 6, 29, 10, 30) },
  ],
  thread2: [
     { id: 'msg2-1', sender: 'user', text: '이서연님, 요청하신 포트폴리오 리뷰 초안 보내드립니다.', timestamp: new Date(2024, 6, 28, 15, 50) },
     { id: 'msg2-2', sender: 'customer', text: '혹시 다음 주 일정 조정 가능할까요?', timestamp: new Date(2024, 6, 28, 16, 5) },
  ],
  thread3: [
    { id: 'msg3-1', sender: 'user', text: '박지훈님, 요청하신 특강 자료입니다.', timestamp: new Date(2024, 6, 27, 9, 10) },
    { id: 'msg3-2', sender: 'customer', text: '자료 잘 받았습니다.', timestamp: new Date(2024, 6, 27, 9, 15) },
  ],
};

export default function MessagesCenterPage() {
  const [threads, setThreads] = useState<MessageThread[]>(dummyThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(dummyThreads[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredThreads = threads.filter(thread =>
    thread.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedMessages = selectedThreadId ? dummyMessages[selectedThreadId] || [] : [];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedThreadId) return;

    const messageToSend: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: newMessage,
      timestamp: new Date(),
    };

    dummyMessages[selectedThreadId] = [...(dummyMessages[selectedThreadId] || []), messageToSend];
    setThreads(prevThreads => prevThreads.map(thread =>
      thread.id === selectedThreadId
        ? { ...thread, lastMessage: newMessage, lastMessageTime: new Date() }
        : thread
    ));

    setNewMessage('');
    console.log(`Message sent in thread ${selectedThreadId}: ${newMessage}`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 h-[calc(100vh-theme(space.16))] flex flex-col">
      <h1 className="text-2xl font-bold text-text-primary mb-6">메시지 센터</h1>

      <div className="flex border rounded-lg flex-1 overflow-hidden">
        <div className="w-1/3 border-r flex flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="고객명 검색..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {filteredThreads.map((thread) => (
              <button
                key={thread.id}
                className={cn(
                  "flex items-center w-full p-4 border-b hover:bg-gray-50 text-left",
                  selectedThreadId === thread.id && "bg-gray-100"
                )}
                onClick={() => setSelectedThreadId(thread.id)}
              >
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={thread.avatarUrl} alt={thread.customerName} />
                  <AvatarFallback>{thread.customerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-semibold truncate">{thread.customerName}</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(thread.lastMessageTime, { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                     <p className="text-xs text-muted-foreground truncate">{thread.lastMessage}</p>
                     {thread.unreadCount > 0 && (
                       <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                         {thread.unreadCount}
                       </span>
                     )}
                   </div>
                </div>
              </button>
            ))}
            {filteredThreads.length === 0 && (
               <p className="p-4 text-center text-muted-foreground">검색 결과가 없습니다.</p>
            )}
          </ScrollArea>
        </div>

        <div className="w-2/3 flex flex-col bg-white">
          {selectedThreadId && threads.find(t => t.id === selectedThreadId) ? (
            <>
              <ScrollArea className="flex-1 p-4 space-y-4">
                {selectedMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex items-end space-x-2",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender === 'customer' && (
                      <Avatar className="h-8 w-8">
                         <AvatarImage src={threads.find(t => t.id === selectedThreadId)?.avatarUrl} />
                         <AvatarFallback>{threads.find(t => t.id === selectedThreadId)?.customerName.charAt(0)}</AvatarFallback>
                       </Avatar>
                    )}
                    <div
                      className={cn(
                        "max-w-[70%] p-3 rounded-lg",
                        message.sender === 'user'
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-text-primary"
                      )}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={cn(
                          "text-xs mt-1",
                           message.sender === 'user' ? "text-blue-200 text-right" : "text-muted-foreground text-left"
                         )}>
                         {format(message.timestamp, "HH:mm")}
                       </p>
                    </div>
                     {message.sender === 'user' && (
                       <Avatar className="h-8 w-8">
                         <AvatarFallback>나</AvatarFallback>
                       </Avatar>
                     )}
                  </div>
                ))}
              </ScrollArea>
              <div className="p-4 border-t flex items-center space-x-2 bg-white">
                <Input
                  placeholder="메시지를 입력하세요..."
                  value={newMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSendMessage(); }}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <SendIcon className="h-4 w-4" />
                  <span className="sr-only">전송</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              왼쪽 목록에서 대화를 선택하세요.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
