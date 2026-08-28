<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Authority;
use Illuminate\Support\Facades\Hash;


class AuthorityAuthController extends Controller
{

    public function signup(Request $request)
     {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.Authority::class],
            'institution' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'id_number' => ['string', 'uppercase', 'max:255'],
            'password' => ['required', 'confirmed', "min:8"],
        ]);

        $authority = Authority::create($data);

        $token = $authority->createToken($authority->name);

        return response()->json([
            'authority' => $authority,
            'token' => $token->plainTextToken
        ], 201)->setEncodingOptions(JSON_PRETTY_PRINT);

     }

     public function login(Request $request)
     {
        $request->validate([
            'email' => ['required', 'email', 'exists:authorities'],
            'password' => ['required'],
        ]);

        $authority = Authority::where('email', $request->email)->first();

        if(empty($authority) || !Hash::check($request->password, $authority->password)){
            return response()->json([
                'error' => "Invalid email or password"
            ], 400)->setEncodingOptions((JSON_PRETTY_PRINT));
        }
        $token = $authority->createToken($authority->email)->plainTextToken;

        return response()->json([
            'authority' => $authority,
            'token' => $token
        ])->setEncodingOptions((JSON_PRETTY_PRINT));


     }
//      public function logout(Request $request)
//      {
//         $request->user()->Tokens()->delete();

//         return response()->json([
//             'message' => 'You are logged out'
//         ], 200)->setEncodingOptions(JSON_PRETTY_PRINT);
// }


}
