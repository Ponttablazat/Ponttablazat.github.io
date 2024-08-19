"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, database } from "@/app/lib/firebase";
import {
    ColumnDef,
    SortingState,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Button
} from "@/components/ui/button"
import firebase from "firebase/compat/app";
import DataSnapshot = firebase.database.DataSnapshot;

export type ChildData = {
    nev: string;
    pontok: string;
};

export default function KezeloClientComponent() {
    const [data, setData] = useState<ChildData[]>([]);
    const [loading, setLoading] = useState(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async (user: User, honap: number) => {
            if (user) {
                const dataRef = ref(database, "/1/");

                try {
                    const snapshot = await get(dataRef);
                    console.log("Snapshot:", snapshot.val()); // Debugging log
                    if (snapshot.exists() && isMounted) {
                        const children: ChildData[] = [];
                        const azonositoList: DataSnapshot[] = []; // Explicitly type as DataSnapshot[]

                        snapshot.forEach((azonosito) => {
                            azonositoList.push(azonosito);
                        });

                        for (const azonosito of azonositoList) {
                            const azonositoVal = azonosito.val();
                            console.log("Azonosito:", azonosito.key, azonositoVal); // Debugging log

                            let elert: number = 0;
                            let max: number = 0;

                            const pontok = azonositoVal[honap.toString()];
                            console.log("Pontok:", pontok); // Debugging log
                            if (pontok) {
                                let darabok: string[] = pontok.split(",");
                                darabok.shift();

                                for (const darab of darabok) {
                                    const slashIndex: number = darab.indexOf("/");
                                    if (slashIndex !== -1) {
                                        const elertStr = darab.substring(0, slashIndex);
                                        const maxStr = darab.substring(slashIndex + 1);

                                        const elertValue = parseFloat(elertStr);
                                        const maxValue = parseFloat(maxStr);

                                        if (!isNaN(elertValue) && !isNaN(maxValue)) {
                                            elert += elertValue;
                                            max += maxValue;
                                        }
                                    }
                                }
                            }
                            console.log("Elert:", elert, "Max:", max); // Debugging log

                            children.push({
                                nev: azonositoVal.nev,
                                pontok: elert.toString() + "/" + max.toString(),
                            });
                        }
                        setData(children);
                    } else {
                        console.log("No data available");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else {
                console.log("User not authenticated");
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchData(user, 1);
            } else {
                console.log("No user signed in");
                if (isMounted) {
                    setLoading(false);
                }
            }
        });

        return () => {
            isMounted = false;
            unsubscribe();
        };
    }, []);

    const columns: ColumnDef<ChildData>[] = [
        {
            accessorKey: "nev",
            header: () => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        setSorting((prev) =>
                            prev[0]?.id === "nev" && prev[0]?.desc
                                ? []
                                : [{ id: "nev", desc: !prev[0]?.desc }]
                        )
                    }
                >
                    Név
                </Button>
            ),
            cell: ({ row }) => (
                <div className="font-bold">{row.getValue("nev")}</div>
            ),
        },
        {
            accessorKey: "pontok",
            header: () => (
                <Button
                    variant="ghost"
                    onClick={() =>
                        setSorting((prev) =>
                            prev[0]?.id === "pontok" && prev[0]?.desc
                                ? []
                                : [{ id: "pontok", desc: !prev[0]?.desc }]
                        )
                    }
                >
                    Pontok
                </Button>
            ),
            cell: ({ row }) => <div className="font-bold">{row.getValue("pontok")}</div>,
        },
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (

        <div className="flex items-center justify-center py-[25px]">
            {loading ? (
                <div className="rounded-md border w-[60%]">
                    <p className="font-bold">Töltés</p>
                </div>
            ) : (
                <div className="rounded-md border w-[60%]">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {data.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No data available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
