'use client'

import { CreateCategorySchema } from '@/schema/categories'
import React from 'react'
import { useForm } from 'react-hook-form'
import { CreateCategorySchemaType } from '@/schema/categories'
import { zodResolver } from '@hookform/resolvers/zod'
import { TransactionType } from '@/lib/types'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { PlusSquare } from 'lucide-react'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
interface Props {
    type: TransactionType
}
const CreateCategoryDialog = ({ type }: Props) => {
    const [open, setOpen] = React.useState(false)
    const form = useForm<CreateCategorySchemaType>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            type
        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} className='flex border-separate items-center justify-start rounded-none border-b px-3 py-3 text-muted-foreground'>
                    <PlusSquare className='mr-2 h-4 w-4' />
                    Create new
                </Button>
            </DialogTrigger>
            <DialogContent  className="dark:bg-zinc-900 z-50" >
                <DialogHeader>
                    <DialogTitle>
                        Create{" "}
                        <span className={type === 'income' ? 'text-emerald-500' : 'text-red-500'}>{type}</span> category
                    </DialogTitle>
                    <DialogDescription>
                        Categories are used to group your transactions
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className='space-y-8'>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input defaultValue={""} {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Transaction description (optional)
                                    </FormDescription>
                                </FormItem>
                            )}
                        /></form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCategoryDialog