import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const page = () => {
  return (
    <div className="flex-grow bg-gradient-to-br from-emerald-50 to-amber-50 p-4 pt-8 md:p-8 flex flex-row">
      <div className="flex w-full gap-2">
        <Card className="border-gray-200 grow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tambah Materi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">12</div>
              <div className="rounded-full bg-emerald-100 p-2 text-emerald-600"></div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 grow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Tambah Tugas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">248</div>
              <div className="rounded-full bg-amber-100 p-2 text-amber-500"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default page;
