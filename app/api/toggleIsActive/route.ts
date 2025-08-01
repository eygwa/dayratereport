import {NextRequest} from "next/server";
import {getSession} from "@/actions";
import {connectToDb} from "@/utils/connectToDb";

export const GET = async (request: NextRequest) => {
    //block non-admins
    const session = await getSession();
    const {searchParams} = request.nextUrl;
    const user = searchParams.get("uid") || "";
    const isActive = searchParams.get("active") === '1' || false;

    if (!session.isAdmin) return new Response(JSON.stringify({error: "not an admin"}), {
        status: 500,
    });
    if (session.userId === user) return new Response(JSON.stringify({error: "cannot modify your own status"}), {
        status: 500,
    });
    const connection = await connectToDb();

    console.log((isActive ? '0' : '1'))
    try {
        const query = `UPDATE users
                       SET isActive=?
                       WHERE uid = ?`;
        const extra: string[] = [(isActive ? '0' : '1'), user];
        const [resp] = await connection.execute(query, extra);
        console.log(resp);

        connection.end();
        return new Response(JSON.stringify({error: resp}), {
            status: 200,
        });

    } catch (e) {
        connection.end();
        return new Response(JSON.stringify({error: e}), {
            status: 500,
        });
    }

}