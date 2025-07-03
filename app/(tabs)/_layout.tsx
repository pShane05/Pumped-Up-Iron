import { Tabs } from "expo-router"
import { COLORS } from "../costants"

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarActiveBackgroundColor: '#E113C5',
            tabBarActiveTintColor: '#10002B',
            tabBarInactiveBackgroundColor: COLORS.PURPLE,
            headerStyle: {
                backgroundColor: '#10002B'
            },
            headerTintColor: '#E113C5',
            tabBarStyle: {
                backgroundColor: '#10002B'
            }
             }}>
                <Tabs.Screen
                    name="index"
                    options={{
                        headerTitle: 'Home',
                        /*tabBarIcon: ({ focused, color }) => (

                        ),*/
                    }}
                />

                <Tabs.Screen
                    name="shop"
                    options={{
                        headerTitle: "Shop",
                    }}
                />

                <Tabs.Screen
                    name="base"
                    options={{
                        headerTitle: "Base",
                    }}
                />

                <Tabs.Screen
                    name="avatar"
                    options={{
                        headerTitle: "Avatar",
                    }}
                />
        </Tabs>
    )
}