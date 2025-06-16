/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Separator } from "../ui/separator";


export interface FilterOption {
  key: string; // Property to filter on (e.g., "user_id")
  value: string | null; // Value to match (null for all)
  tabLabel: string; // Optional label for the tab
}

interface TabsCardProps {
  items: any[]; // Array of data objects
  cardTitle?: string; // Optional title for the card
  hasSeparators?: boolean; // Optional prop to add separators between picks
  cardDescription?: string; // Optional description for the card
  filterableOptions: FilterOption[]; // Filtering criteria for each tab
  ComponentDiv: React.ComponentType<{ data: any }>; // Component to render picks
}

export default function TabsCard({
  items,
  //tabLabels,
  hasSeparators = false,
  cardTitle,
  cardDescription,
  filterableOptions,
  ComponentDiv,
}: TabsCardProps) {
  const tabLabels = filterableOptions.map(opt => opt.tabLabel || opt.key);
  const [activeTab, setActiveTab] = useState(tabLabels[0]?.toLowerCase() || "all");

  // Map tab labels to lowercase values
  const tabValues = tabLabels.map((label: string) => label.toLowerCase());

  // Filter picks for the active tab
  const filteredPicks = items.filter((pick) => {
    const filterOption = filterableOptions.find(
      (opt, index) => tabValues[index] === activeTab
    );
    if (!filterOption) return false;
    return filterOption.value === null || pick[filterOption.key] === filterOption.value;
  });

  return (
    <div className="flex w-full max-w-md flex-col ">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue={tabLabels[0]?.toLowerCase() || "all"}
      >
        <TabsList className="grid w-fit translate-y-1" style={{ gridTemplateColumns: `repeat(${tabLabels.length}, 1fr)` }}>
          {tabLabels.map((label) => (
            <TabsTrigger key={label} value={label.toLowerCase()}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Card>
          <CardHeader className="mb-0 pb-0">
            {tabLabels.map((label) => (
              <TabsContent key={label} value={label.toLowerCase()}>
                <CardTitle className='pb-3'>{cardTitle || ''}</CardTitle>
                <CardDescription className="mb-0 pb-0">
                  {cardDescription || ''}
                </CardDescription>
              </TabsContent>
            ))}
          </CardHeader>
          <CardContent className="grid gap-4 mt-0 pt-0">
            {filteredPicks.length ? (
              filteredPicks.map((data,index:number) => (
                
                            <div key={index} className="flex flex-col justify-between">
                              <ComponentDiv data={data} />
                              {hasSeparators && index !== data.length - 1 &&
                                <Separator orientation="horizontal" className='bg-muted' />
                              }
                            </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No picks available.</p>
            )}
          </CardContent>
          {/* <CardFooter className="flex justify-end">
            <Button type="submit">Refresh</Button>
          </CardFooter> */}
        </Card>
      </Tabs>
    </div>
  );
}