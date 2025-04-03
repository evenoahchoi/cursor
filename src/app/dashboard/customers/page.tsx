"use client";

// src/app/dashboard/customers/page.tsx
import React, { useState, useEffect } from 'react';
import { UserPlus as UserPlusIcon, Filter as FilterIcon, Search as SearchIcon } from 'lucide-react';
import { format } from 'date-fns'; // date-fns에서 format 함수 import
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// UI 컴포넌트
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Customer 인터페이스: API 응답 형태에 맞게 조정 (날짜는 string으로 받을 수 있음)
interface Customer {
  _id: string; // DB의 _id (문자열)
  id?: string; // 기존 ID (선택적)
  userId?: string;
  name: string;
  email: string;
  phone: string;
  lastBookingDate: string | null; // ISO 문자열 또는 null
  totalSpent: number;
  segment: '신규' | '일반' | '단골' | 'VIP';
  createdAt?: string; // ISO 문자열 (선택적)
}


export default function CustomerManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // ... 나머지 상태 ...
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');

  // 인증 상태 확인 및 리디렉션
  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("인증되지 않은 사용자입니다. 로그인 페이지로 이동합니다.");
      router.push("/");
    }
  }, [status, router]);

  // 고객 목록 로드 함수
  const fetchCustomers = async () => {
    console.log("===== [Client] Fetching customers Start =====");
    setIsLoading(true);
    try {
      // 인증 상태 확인
      if (status !== "authenticated" || !session?.user?.id) {
        console.error("[Client] 로그인이 필요합니다.");
        throw new Error("로그인이 필요합니다.");
      }
      
      console.log("[Client] 세션 정보:", JSON.stringify(session, null, 2));
      
      const response = await fetch('/api/customers');
      console.log("[Client] Fetch response status:", response.status, response.statusText);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        console.error("[Client] Failed to fetch customers:", response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const data: Customer[] = await response.json(); // 타입을 명시적으로 지정
      console.log("[Client] Fetched customers data (raw):", data);

      // API에서 날짜를 ISO 문자열로 반환하므로, 프론트에서는 그대로 사용하거나 필요시 Date 객체로 변환
      // 여기서는 우선 문자열 상태로 저장
      setCustomers(data);
      console.log("[Client] Customers state updated with fetched data.");

    } catch (error) {
      console.error("[Client] Error fetching customers:", error);
      alert(`고객 목록 로드 실패: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
      console.log("===== [Client] Fetching customers End =====");
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchCustomers();
    }
  }, [status]);

  // 필터링 로직 (id 비교 시 _id 사용)
  const filteredCustomers = customers.filter(customer => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = customer.name.toLowerCase().includes(searchTermLower) ||
                          customer.email.toLowerCase().includes(searchTermLower) ||
                          customer.phone.includes(searchTerm) ||
                          customer._id.toLowerCase().includes(searchTermLower); // _id로 검색
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  // ... getSegmentBadgeColor ...
    const getSegmentBadgeColor = (segment: Customer['segment']) => {
      switch (segment) {
        case '신규': return 'bg-gray-100 text-gray-800';
        case '일반': return 'bg-blue-100 text-blue-800';
        case '단골': return 'bg-green-100 text-green-800';
        case 'VIP': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

  // 신규 고객 저장 함수
  const handleSaveCustomer = async () => {
    console.log("===== [Client] Saving customer Start =====");
    console.log("[Client] Data to save:", { newCustomerName, newCustomerEmail, newCustomerPhone });
    if (!newCustomerName.trim()) {
      alert('고객 이름은 필수입니다.');
      console.log("===== [Client] Saving customer End (Validation Fail) =====");
      return;
    }

    try {
      console.log("[Client] Sending POST request to /api/customers");
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCustomerName.trim(),
          email: newCustomerEmail.trim(),
          phone: newCustomerPhone.trim(),
        }),
      });
      console.log("[Client] Save response status:", response.status, response.statusText);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Failed to parse error response" }));
        console.error("[Client] Failed to save customer:", response.status, errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const savedCustomer: Customer = await response.json(); // 타입 명시
      console.log("[Client] Saved customer data from API:", savedCustomer);

      // API에서 받은 데이터 (날짜는 문자열 상태)를 그대로 상태에 추가
      setCustomers(prevCustomers => [savedCustomer, ...prevCustomers]);
      console.log("[Client] Customer added to state.");

      setNewCustomerName('');
      setNewCustomerEmail('');
      setNewCustomerPhone('');
      setIsModalOpen(false);
      console.log("[Client] Modal closed and fields reset.");
      console.log("===== [Client] Saving customer End (Success) =====");

    } catch (error) {
      console.error("[Client] Error saving customer:", error);
      alert(`고객 저장 실패: ${error instanceof Error ? error.message : String(error)}`);
      console.log("===== [Client] Saving customer End (Error) =====");
    }
  };

  // JSX 렌더링 (날짜 포맷팅 시 new Date() 사용)
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* ... (페이지 제목, 등록 버튼 Dialog, 필터 영역 - 이전과 동일하게 유지) ... */}
       <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">고객 관리</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlusIcon className="mr-2 h-4 w-4" /> 신규 고객 등록
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>신규 고객 등록</DialogTitle>
              <DialogDescription>
                새로운 고객 정보를 입력하고 저장하세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  이름
                </Label>
                <Input
                  id="name"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomerEmail}
                  onChange={(e) => setNewCustomerEmail(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  연락처
                </Label>
                <Input
                  id="phone"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button type="button" onClick={handleSaveCustomer}>저장</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
              placeholder="고객명, 이메일, 연락처, 고객ID 검색..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={segmentFilter} onValueChange={setSegmentFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="고객 등급 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 등급</SelectItem>
              <SelectItem value="신규">신규</SelectItem>
              <SelectItem value="일반">일반</SelectItem>
              <SelectItem value="단골">단골</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle className="text-lg">고객 목록</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="flex justify-center items-center h-24">
               <p className="text-muted-foreground">고객 목록을 불러오는 중...</p>
             </div>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>고객 ID</TableHead>
                   <TableHead>이름</TableHead>
                   <TableHead>이메일</TableHead>
                   <TableHead>연락처</TableHead>
                   <TableHead>마지막 예약일</TableHead>
                   <TableHead>등급</TableHead>
                   <TableHead className="text-right">총 구매액</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredCustomers.length > 0 ? (
                   filteredCustomers.map((customer) => (
                     <TableRow key={customer._id}>
                       <TableCell className="font-medium">{customer._id}</TableCell>
                       <TableCell>{customer.name}</TableCell>
                       <TableCell>{customer.email}</TableCell>
                       <TableCell>{customer.phone}</TableCell>
                       <TableCell>
                         {customer.lastBookingDate ? format(new Date(customer.lastBookingDate), "yyyy-MM-dd") : '-'}
                       </TableCell>
                       <TableCell>
                         <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSegmentBadgeColor(customer.segment)}`}>
                           {customer.segment}
                         </span>
                       </TableCell>
                       <TableCell className="text-right">{customer.totalSpent.toLocaleString()}원</TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                       {searchTerm || segmentFilter !== 'all' ? '해당 조건의 고객 정보가 없습니다.' : '등록된 고객 정보가 없습니다.'}
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
