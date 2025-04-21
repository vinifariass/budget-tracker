'use server'

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransaction(form: CreateTransactionSchemaType) {
    const parsedBody = CreateTransactionSchema.safeParse(form)
    if (!parsedBody.success) {
        throw new Error(parsedBody.error.message)
    }

    const user = await currentUser()
    if (!user) {
        redirect('/sign-in')
    }

    const { amount, description, date, category, type } = parsedBody.data
    const categoryRow = await prisma.category.findFirst({
        where: {
            name: category,
            userId: user.id
        }
    })

    if (!categoryRow) {
        throw new Error("Category not found")
    }

    // Note: don't make confusion between $transaction ( prisma ) and prisma.transaction ( table )

    await prisma.$transaction([
        prisma.transaction.create({
            data: {
                amount,
                description: description || '',
                type,
                date,
                category: categoryRow.name,
                userId: user.id,
                categoryIcon: categoryRow.icon,
            }
        }),

        //Update month aggregates table
        prisma.monthHistory.upsert({
            where: {
                day_month_year_userId: {
                    userId: user.id,
                    day: date.getUTCDate(),
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },
            create: {
                userId: user.id,
                day: date.getUTCDate(),
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === 'income' ? amount : 0,
                expense: type === 'expense' ? amount : 0,
            },
            update: {
              expense: {
                increment: type === 'expense' ? amount : 0
              },
              income: {
                increment: type === 'income' ? amount : 0
              }    
            }
        }),

        //Update year aggregates table
        prisma.yearHistory.upsert({
            where: {
                month_year_userId: {
                    userId: user.id,
                    month: date.getUTCMonth(),
                    year: date.getUTCFullYear()
                }
            },
            create: {
                userId: user.id,
                month: date.getUTCMonth(),
                year: date.getUTCFullYear(),
                income: type === 'income' ? amount : 0,
                expense: type === 'expense' ? amount : 0,
            },
            update: {
                expense: {
                    increment: type === 'expense' ? amount : 0
                },
                income: {
                    increment: type === 'income' ? amount : 0
                }
            }
        })
    ])
}