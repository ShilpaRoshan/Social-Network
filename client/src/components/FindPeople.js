import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        axios.get("/api/users/most-recent").then((response) => {
            console.log("[setRecentUsers-data]", response.data);
            setRecentUsers(response.data);
        });
    }, []);

    useEffect(() => {
        if (searchTerm.length > 2) {
            axios
                .get("/api/users/search?value=" + { searchTerm })
                .then((response) => {
                    console.log("[setSearchTerm-data]", response.data);
                    setSearchTerm(response.data);
                });
        }
    }, [searchTerm]);

    function onChange(event) {
        console.log("[search value in input-field]", event.target.value);
        setSearchTerm(event.target.value);
    }

    function renderMostRecentUsers() {
        return recentUsers.map((user) => {
            console.log("[user-in-renderMostRecentUsers]", user);
            return (
                <li key={user.id}>
                    {user.firstName}
                    {user.lastName}
                </li>
            );
        });
    }

    function renderSearchResults() {
        return results.map((user) => {
            return (
                <li key={user.id}>
                    <img src={user.profileUrl}></img>
                    <Link to={`/users/${user.id}`}>
                        {user.firstName} {user.lastName}
                    </Link>
                </li>
            );
        });
    }

    return (
        <section className="find-people">
            <h2>Find People</h2>
            <section>
                <h3>New Members!!</h3>
                <ul>{renderMostRecentUsers()}</ul>
            </section>
            <section>
                <h3>Looking for someone in particular?</h3>
                <p>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={onChange}
                    ></input>
                </p>
                <ul>{renderSearchResults()}</ul>
            </section>
        </section>
    );
}
