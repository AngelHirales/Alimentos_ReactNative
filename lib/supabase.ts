// npx expo install @supabase/supabase-js @react-native-async-storage/async-storage @rneui/themed
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = "https://gbpwcqwxfmbakltkowlv.supabase.co";
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdicHdjcXd4Zm1iYWtsdGtvd2x2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NjYzMjUsImV4cCI6MjA2MTU0MjMyNX0._ldUd0FM9-Q1U1ISgvhLHfryWWjyAUgqXfs2Wm2WMOI";

export const supabase = createClient(url, key, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
});