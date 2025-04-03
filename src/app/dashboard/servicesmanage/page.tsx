"use client";

import React, { useState } from 'react';
import { SearchIcon, FilterIcon, PlusCircleIcon, MoreHorizontal } from 'lucide-react'; // Lucide 아이콘 사용
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Badge 컴포넌트 추가
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // DropdownMenu 추가

// 더미 데이터 타입 정의
interface Service {
  id: string;
  name: string;
  category: string;
  duration: number; // 분 단위
  price: number;
  status: '활성' | '비활성';
}

// 더미 서비스 데이터
const dummyServices: Service[] = [
  { id: 'SVC001', name: '1:1 커리어 컨설팅', category: '컨설팅', duration: 60, price: 150000, status: '활성' },
  { id: 'SVC002', name: '포트폴리오 리뷰', category: '리뷰', duration: 45, price: 80000, status: '활성' },
  { id: 'SVC003', name: '면접 대비 특강', category: '특강', duration: 90, price: 120000, status: '활성' },
  { id: 'SVC004', name: '자소서 첨삭', category: '첨삭', duration: 30, price: 50000, status: '비활성' },
  { id: 'SVC005', name: '그룹 스터디 운영', category: '스터디', duration: 120, price: 200000, status: '활성' },
];

// 카테고리 예시 (필터용)
const categories = ['전체', '컨설팅', '리뷰', '특강', '첨삭', '스터디'];

export default function ServiceManagementPage() {
  const [services, setServices] = useState<Service[]>(dummyServices);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('전체');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // 검색 및 필터링 로직
  const filteredServices = services.filter(service => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = service.name.toLowerCase().includes(searchTermLower) ||
                          service.id.toLowerCase().includes(searchTermLower);
    const matchesCategory = categoryFilter === '전체' || service.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleStatusToggle = (serviceId: string) => {
    setServices(currentServices =>
      currentServices.map(service =>
        service.id === serviceId
          ? { ...service, status: service.status === '활성' ? '비활성' : '활성' }
          : service
      )
    );
  };

  // 삭제 함수 (더미)
  const handleDeleteService = (serviceId: string) => {
    if (window.confirm(`정말로 서비스 ID '${serviceId}'를 삭제하시겠습니까?`)) {
      setServices(currentServices => currentServices.filter(service => service.id !== serviceId));
      // 실제 구현 시에는 API 호출 등을 통해 서버 데이터도 삭제해야 합니다.
      console.log(`Service ${serviceId} deleted (dummy)`);
    }
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-text-primary">서비스 관리</h1>
        <Button>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> 신규 서비스 등록
        </Button>
      </div>

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
              placeholder="서비스명, 서비스ID 검색..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="카테고리 필터" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="상태 필터" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="활성">활성</SelectItem>
              <SelectItem value="비활성">비활성</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 서비스 목록 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">서비스 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>서비스 ID</TableHead>
                <TableHead>서비스명</TableHead>
                <TableHead>카테고리</TableHead>
                <TableHead>소요시간</TableHead>
                <TableHead className="text-right">가격</TableHead>
                <TableHead>상태</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.id}</TableCell>
                    <TableCell>{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.duration}분</TableCell>
                    <TableCell className="text-right">{service.price.toLocaleString()}원</TableCell>
                    <TableCell>
                      <Badge variant={service.status === '활성' ? 'default' : 'outline'}>
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">메뉴 열기</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>작업</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => console.log(`Edit service ${service.id}`)} // TODO: 실제 수정 로직 연결
                          >
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(service.id)}>
                            {service.status === '활성' ? '비활성화' : '활성화'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                             className="text-red-600"
                             onClick={() => handleDeleteService(service.id)}
                          >
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    해당 조건의 서비스 정보가 없습니다.
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
