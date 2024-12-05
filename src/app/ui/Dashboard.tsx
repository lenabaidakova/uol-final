"use client";

import {useRole} from "@/providers/RoleProvider";
import ShelterDashboard from "@/app/ui/ShelterDashboard";
import SupporterDashboard from "@/app/ui/SupporterDashboard";

export default function Dashboard () {
    const {role} = useRole();

    if (role === 'shelter') {
        return (
            <ShelterDashboard />
        )
    }
    return (
        <SupporterDashboard />
    )
}
