"use client";
import React from "react";

import { PickClientType } from "@/models/Pick";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";


export default function PeekDiv({ data }: { data: PickClientType }) {
  //const player = players.find(player => player._id === data.player_id);
  return (
    <div className="flex flex-row items-center justify-start py-1 gap-4 rounded-lg">
      <Avatar className='size-6'>
        {/* <AvatarImage src={data.driver?.image || ''} alt={data.driver?.name || 'Driver Avatar'} /> */}
        <AvatarFallback className='bg-accent flex size-6 items-center justify-center text-xs'>
          {data?.name?.charAt(0) || ''}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-row items-start space-x-4">
        <div className="text-sm">{`${data.nickname}`}</div>
        <div className="text-sm text-muted-foreground">{`|`}</div>
        <div className="text-secondary-foreground font-light text-sm">{`${data.name}`}</div>
      </div>
    </div>
  )
}