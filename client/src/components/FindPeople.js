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
        if (searchTerm.length > 1) {
            axios
                .get("/api/users/search?value=" + searchTerm)
                .then((response) => {
                    console.log("[setSearchTerm-data]", response.data);
                    setResults(response.data);
                });
        }
    }, [searchTerm]);

    function onChange(event) {
        console.log("[search value in input-field]", event.target.value);
        setSearchTerm(event.target.value);
    }

    function renderMostRecentUsers() {
        return recentUsers.map((user) => {
            //console.log("[user-in-renderMostRecentUsers]", user);
            return (
                <li key={user.id} className="list-newMembers">
                    <Link to={`/api/user/${user.id}`}>
                        {user.first_name} {user.last_name}
                    </Link>
                </li>
            );
        });
    }

    function renderSearchResults() {
        return results.map((user) => {
            console.log("[user-in-renderSearchResults]", user);
            return (
                <li key={user.id} className="li-find-people">
                    <img
                        src={user.profile_url}
                        className="find-people-image"
                    ></img>
                    <Link to={`/users/${user.id}`} className="search-username">
                        {user.first_name} {user.last_name}
                    </Link>
                </li>
            );
        });
    }

    return (
        <section className="find-people">
            <h2 className="find-people-header">Find People</h2>
            <section className="newMembers">
                <h3 className="sub-header-newmembers">New Members!!</h3>
                <ul className="container-list-new-members">
                    {renderMostRecentUsers()}
                </ul>
            </section>

            <section className="newMembers">
                <h3 className="sub-header-newmembers">
                    Looking for someone in particular?
                </h3>
                <p>
                    <input
                        type="text"
                        placeholder="Search"
                        onChange={onChange}
                        className="input-search"
                    ></input>
                </p>
                <ul className="list-search">{renderSearchResults()}</ul>
            </section>
        </section>
    );
}
