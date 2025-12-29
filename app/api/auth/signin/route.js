import { getConnection } from '@/lib/db';
import sql from 'mssql';
import bcrypt from 'bcryptjs';

export async function POST ( req ) {
    try
    {
        const form = await req.formData();
        const email = form.get( 'email' );
        const password = form.get( 'password' );

        const pool = await getConnection();
        const userResult = await pool.request()
            .input( 'email', sql.VarChar( 100 ), email )
            .query( 'SELECT * FROM Users WHERE email = @email' );
        if ( userResult.recordset.length === 0 )
        {
            return new Response( JSON.stringify( { success: false, message: 'Invalid email or password' } ), { status: 401 } );
        }
        const user = userResult.recordset[ 0 ];
        const valid = await bcrypt.compare( password, user.password_hash );
        if ( !valid )
        {
            return new Response( JSON.stringify( { success: false, message: 'Invalid email or password' } ), { status: 401 } );
        }

        await pool.request()
            .input( 'id', sql.Int, user.id )
            .query( 'UPDATE Users SET last_login = GETDATE() WHERE id = @id' );

        return new Response( JSON.stringify( { success: true, user: { id: user.id, username: user.username, email: user.email, status: user.status } } ), { status: 200 } );
    } catch ( error )
    {
        return new Response( JSON.stringify( { success: false, error: error.message } ), { status: 500 } );
    }
}
