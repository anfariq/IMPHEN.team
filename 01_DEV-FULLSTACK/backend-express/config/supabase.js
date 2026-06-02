const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const WebSocket = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY; 

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: false,
    },
    realtime: {
        transport: WebSocket
    }
});

module.exports = supabase;