"use client";
import { useState } from "react";
import Sidebar from "../Sidebar";
import Header from "../Header";


const DefaultLayout = ({children}:{children: React.ReactNode}) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
            {/* Page Wrapper Start */}
            <div className="flex h-screen overflow-hidden"> 
                {/* Sidebar Start */}
                <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                {/* Sidebar End */}

                {/* Content Area Start */}
                <div className="relative flex flex-1 flex-col overflow-x-hidden">
                    {/* Header Start */}
                    <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
                    {/* Header End */}

                    {/* Main Content Start */}
                    <main>
                        <div className="mx-auto max-w-screen-2xl p-2 md:p-4 2xl:p-10">
                        {children}
                        </div>
                    </main>
                    {/* Main Content End */}
                </div>
                {/* Content Area End */}
            </div>
            {/* Page Wrapper End */}

        </>
    )

}

export default DefaultLayout;
