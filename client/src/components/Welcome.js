import Registration from "./Registraton";

export default function Welcome() {
    return (
        <div>
            <header>Welcome to our landing page!!</header>
            <section className="content">
                <Registration></Registration>
            </section>
            <p>
                Already Registered? <a href="#">Log in!!</a>
            </p>
        </div>
    );
}
