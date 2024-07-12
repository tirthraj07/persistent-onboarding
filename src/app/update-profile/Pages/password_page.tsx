export default function PasswordPage({
    handlePassword
}:{
    handlePassword: (password: string) => void
}){

    function handleSubmit(){
        handlePassword("password");
    }


    return(
        <>
            Password Page
            <button onClick={handleSubmit}>NEXT</button>
        </>
    );
}