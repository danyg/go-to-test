import User from "./actors/user";

class Lexic {
	public static getInstance() {
		return new Lexic();
	}

	private constructor() { }

	public user() {
		return User.getInstance();
	}
}


export const given = () => Lexic.getInstance();
export const when = () => Lexic.getInstance();
