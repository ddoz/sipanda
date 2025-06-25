"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionIcon, ButtonGroup } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DatePickerInput } from "@mantine/dates";
import { getStatistikKunjungan } from "@/services/statistik-kunjungan";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const StatistikKunjungan = () => {
  const [data, setData] = useState<any[]>([]);
  const [deviceStats, setDeviceStats] = useState<any[]>([]);
  const [pathStats, setPathStats] = useState<any[]>([]);
  const [dateStats, setDateStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [totalVisits, setTotalVisits] = useState(0);
  const [todayVisits, setTodayVisits] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchStatistics();
  }, [currentPage, dateRange]);

  const fetchStatistics = async () => {
    setLoading(true);
    try {
      // Ensure dates are properly formatted with time set to beginning/end of day
      let startDateStr: string | undefined;
      let endDateStr: string | undefined;

      if (dateRange[0]) {
        // Format as YYYY-MM-DD to ensure it's treated as UTC date at 00:00:00
        startDateStr = dateRange[0].toISOString().split("T")[0];
      } else {
        // If no start date is selected, default to 7 days ago
        const lastWeekDate = new Date();
        lastWeekDate.setDate(lastWeekDate.getDate() - 7);
        startDateStr = lastWeekDate.toISOString().split("T")[0];
      }

      if (dateRange[1]) {
        // Format as YYYY-MM-DD to ensure it's treated as UTC date
        endDateStr = dateRange[1].toISOString().split("T")[0];
      }

      const result = await getStatistikKunjungan({
        page: currentPage,
        limit: itemsPerPage,
        startDate: startDateStr,
        endDate: endDateStr,
      });

      if (result.data) {
        setData(result.data);
        setTotalPages(Math.ceil(result.total / itemsPerPage));
        setTotalVisits(result.totalVisits || 0);
        setTodayVisits(result.todayVisits || 0);

        // Only process date statistics - we're removing the device chart
        if (result.dateStats) {
          setDateStats(
            Object.entries(result.dateStats)
              .map(([date, count]) => ({
                date,
                visits: count,
              }))
              .sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime(),
              ),
          );
        }
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateFilter = () => {
    setCurrentPage(1);
    fetchStatistics();
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex flex-row justify-between">
            <h1>Statistik Kunjungan</h1>
            <div className="flex items-center gap-2">
              <DatePickerInput
                type="range"
                placeholder="Filter by date range"
                value={dateRange}
                onChange={setDateRange}
                className="w-64"
              />
              <Button variant="outline" onClick={handleDateFilter}>
                Filter
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Kunjungan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalVisits.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Jumlah seluruh kunjungan aplikasi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kunjungan Hari Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {todayVisits.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Jumlah kunjungan hari ini
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Trend Kunjungan Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dateStats}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [`${value} kunjungan`, "Jumlah"]}
                    labelFormatter={(label) => `Tanggal: ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="visits"
                    name="Jumlah Kunjungan"
                    fill="#82ca9d"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detail Kunjungan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Perangkat</TableHead>
                  <TableHead>Referrer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="flex items-center justify-center py-4">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
                        <span className="ml-2">Loading data...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <div className="py-4 text-muted-foreground">
                        Tidak ada data kunjungan pada periode yang dipilih
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((item, index) => (
                    <TableRow key={item.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </TableCell>
                      <TableCell>{formatDateTime(item.createdAt)}</TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">
                          {item.ipAddress || "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs ${
                            item.device === "mobile"
                              ? "bg-blue-100 text-blue-800"
                              : item.device === "tablet"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {item.device || "Unknown"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div
                          className="max-w-[200px] truncate"
                          title={item.referrer || "Direct"}
                        >
                          {item.referrer
                            ? new URL(item.referrer).hostname || item.referrer
                            : "Direct"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-end">
              <ButtonGroup>
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <IconChevronLeft className="mr-1" /> Prev
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next <IconChevronRight className="ml-1" />
                </Button>
              </ButtonGroup>
              <div className="ml-4 text-sm text-muted-foreground">
                Halaman {currentPage} dari {totalPages || 1}
              </div>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default StatistikKunjungan;
