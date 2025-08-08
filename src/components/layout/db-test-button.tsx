
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Database, Loader2 } from "lucide-react";

export function DbTestButton() {
    const [isTesting, setIsTesting] = useState(false);
    const { toast } = useToast();

    const handleTestConnection = async () => {
        setIsTesting(true);
        try {
            const res = await fetch('/api/db-test');
            const data = await res.json();

            if (res.ok && data.success) {
                toast({
                    title: "Success",
                    description: data.message,
                });
            } else {
                throw new Error(data.error || "An unknown error occurred.");
            }
        } catch (error) {
            console.error("DB Test Error:", error);
            const errorMessage = error instanceof Error ? error.message : "Failed to connect.";
            
            // Provide more helpful messages for common errors
            if (errorMessage.includes("ECONNREFUSED")) {
                 toast({
                    variant: "destructive",
                    title: "Database Connection Refused",
                    description: "Your app connected to your local machine, but the connection was refused. Please ensure your XAMPP MySQL server is running and check that it is using port 3306.",
                    duration: 10000, 
                });
            } else if (errorMessage.includes("ETIMEDOUT")) {
                 toast({
                    variant: "destructive",
                    title: "Database Connection Timed Out",
                    description: "This is likely a firewall issue with a remote host. Please whitelist your app's IP address in your database host's settings.",
                    duration: 10000,
                });
            } else {
                 toast({
                    variant: "destructive",
                    title: "Database Connection Failed",
                    description: errorMessage,
                });
            }
        } finally {
            setIsTesting(false);
        }
    };

    return (
        <Button 
            variant="outline" 
            size="icon" 
            onClick={handleTestConnection} 
            disabled={isTesting}
            title="Test Database Connection"
        >
            {isTesting ? <Loader2 className="animate-spin" /> : <Database />}
            <span className="sr-only">Test Database Connection</span>
        </Button>
    );
}
