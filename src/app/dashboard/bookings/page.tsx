"use client";

import React, { useState } from 'react';
import { CalendarIcon, SearchIcon, FilterIcon } from 'lucide-react'; // Lucide 아이콘 사용
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// 더미 데이터 타입 정의
interface Booking {
  id: string;
  customerName: string;
  serviceName: string;
  dateTime: Date;
  status: '확정' | '완료' | '취소' | '대기';
  price: number;
}

// 더미 예약 데이터
const dummyBookings: Booking[] = [
  { id: 'BK001', customerName: '김민준', serviceName: '1:1 커리어 컨설팅', dateTime: new Date(2024, 6, 28, 10, 0), status: '확정', price: 150000 },
  { id: 'BK002', customerName: '이서연', serviceName: '포트폴리오 리뷰', dateTime: new Date(2024, 6, 27, 14, 30), status: '완료', price: 80000 },
  { id: 'BK003', customerName: '박지훈', serviceName: '면접 대비 특강', dateTime: new Date(2024, 6, 27, 16, 0), status: '확정', price: 120000 },
  { id: 'BK004', customerName: '최유나', serviceName: '1:1 커리어 컨설팅', dateTime: new Date(2024, 6, 26, 11, 0), status: '완료', price: 150000 },
  { id: 'BK005', customerName: '정재현', serviceName: '자소서 첨삭', dateTime: new Date(2024, 6, 26, 15, 0), status: '취소', price: 50000 },
  { id: 'BK006', customerName: '윤지아', serviceName: '포트폴리오 리뷰', dateTime: new Date(2024, 6, 29, 9, 0), status: '대기', price: 80000 },
  { id: 'BK007', customerName: '강태민', serviceName: '1:1 커리어 컨설팅', dateTime: new Date(2024, 6, 30, 13, 0), status: '확정', price: 150000 },
];

export default function BookingManagementPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [bookings, setBookings] = useState<Booking[]>(dummyBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  // 검색 및 필터링 로직 (간단 예시)
  const filteredBookings = bookings.filter(booking => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTermLower) ||
                          booking.serviceName.toLowerCase().includes(searchTermLower) ||
                          booking.id.toLowerCase().includes(searchTermLower);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    // 날짜 비교 로직 수정: date 상태가 있을 경우에만 비교
    const matchesDate = !date || format(booking.dateTime, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');

    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadgeColor = (status: Booking['status']) => {
    switch (status) {
      case '확정': return 'bg-blue-100 text-blue-800';
      case '완료': return 'bg-green-100 text-green-800';
      case '취소': return 'bg-red-100 text-red-800';
      case '대기': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <h1 className="text-2xl font-bold text-text-primary">예약 관리</h1>

      {/* 필터 및 검색 영역 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <FilterIcon className="h-5 w-5 mr-2" />
            필터 및 검색
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="고객명, 서비스명, 예약ID 검색..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="확정">확정</SelectItem>
              <SelectItem value="완료">완료</SelectItem>
              <SelectItem value="취소">취소</SelectItem>
              <SelectItem value="대기">대기</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>날짜 선택</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>

      {/* 예약 목록 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">예약 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>예약 ID</TableHead>
                <TableHead>고객명</TableHead>
                <TableHead>서비스명</TableHead>
                <TableHead>예약 일시</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">금액</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.id}</TableCell>
                    <TableCell>{booking.customerName}</TableCell>
                    <TableCell>{booking.serviceName}</TableCell>
                    <TableCell>{format(booking.dateTime, "yyyy-MM-dd HH:mm")}</TableCell>
                    <TableCell>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{booking.price.toLocaleString()}원</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    해당 조건의 예약 내역이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
