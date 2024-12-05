import PageHeader from "@/app/ui/PageHeader";
import {Box, Grid} from "@radix-ui/themes";
import {Card, CardHeader, CardTitle, CardContent, CardDescription} from "@/components/ui/card";
import {Check, Clipboard, MessageCircle} from "lucide-react";
import {DatePickerWithRange} from "@/app/ui/DatePickerWithRange";
import {RequestsChart} from "@/app/ui/RequestsChart";
import React from "react";
import {SupporterRequestsInProgress} from "@/app/ui/SupporterRequestsInProgress";

export default function SupporterDashboard() {
    return (
        <>
            <PageHeader heading="Alex Johnson's Dashboard" columns="auto 1fr auto" actions={<DatePickerWithRange />} />

            <Box maxWidth="1400px" m="auto" px="4">
                <Grid gap="3" columns="1fr 1fr 1fr">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Requests in progress
                            </CardTitle>
                            <Clipboard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">7</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Fulfilled requests
                            </CardTitle>
                            <Check className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">11</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-x-2 space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Unread messages
                            </CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid gap="3" columns="1fr 1fr" mt="3">
                    <Box>
                        <Card>
                            <CardHeader>
                                <CardTitle>Recently contributed</CardTitle>
                                <CardDescription>
                                    See your latest contributions and the impact you’ve made
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <SupporterRequestsInProgress />
                            </CardContent>
                        </Card>
                    </Box>

                    <Box>
                        <RequestsChart />
                    </Box>
                </Grid>
            </Box>
        </>
    );
}
