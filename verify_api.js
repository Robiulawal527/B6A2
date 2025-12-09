async function test() {
    try {
        const email = `test_${Date.now()}@example.com`;
        console.log("Testing with email:", email);

        const signupConf = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: "Auto Test User",
                email: email,
                password: "password123",
                phone: "1234567890",
                role: "customer",
                address: "123 Test Lane"
            })
        };

        console.log("Step 1: Signing up...");
        const r1 = await fetch('http://localhost:3000/api/v1/auth/signup', signupConf);
        const d1 = await r1.json();
        console.log("Signup Response:", JSON.stringify(d1, null, 2));

        if (!d1.success) {
            console.error("Signup failed!");
            return;
        }

        const signinConf = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                password: "password123"
            })
        };

        console.log("Step 2: Signing in...");
        const r2 = await fetch('http://localhost:3000/api/v1/auth/signin', signinConf);
        const d2 = await r2.json();
        console.log("Signin Response:", JSON.stringify(d2, null, 2));

    } catch (e) { console.error("Error:", e); }
}
test();
