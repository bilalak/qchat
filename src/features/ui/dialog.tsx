import * as Dialog from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import React from "react"

import { Button } from "@/features/ui/button"

export const Dailog = (): React.JSX.Element => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <Button variant={"default"}>Edit profile</Button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-background data-[state=open]:animate-overlayShow" />
      <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none data-[state=open]:animate-contentShow">
        <Dialog.Title className="m-0 text-[17px] font-medium text-primary">Edit profile</Dialog.Title>
        <Dialog.Description className="mb-5 mt-[10px] text-[15px] leading-normal text-primary">
          Make changes to your profile here. Click save when you&apos;re done.
        </Dialog.Description>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label className="w-[90px] text-right text-[15px] text-primary" htmlFor="name">
            Name
          </label>
          <input
            className="shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-primary shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="name"
            defaultValue="Pedro Duarte"
          />
        </fieldset>
        <fieldset className="mb-[15px] flex items-center gap-5">
          <label className="w-[90px] text-right text-[15px] text-primary" htmlFor="username">
            Username
          </label>
          <input
            className="shadow-violet7 focus:shadow-violet8 inline-flex h-[35px] w-full flex-1 items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-primary shadow-[0_0_0_1px] outline-none focus:shadow-[0_0_0_2px]"
            id="username"
            defaultValue="@peduarte"
          />
        </fieldset>
        <div className="mt-[25px] flex justify-end">
          <Dialog.Close asChild>
            <Button variant={"default"}>Save changes</Button>
          </Dialog.Close>
        </div>
        <Dialog.Close asChild>
          <Button variant={"destructive"} ariaLabel="Close">
            <X />
          </Button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)

export default Dialog
