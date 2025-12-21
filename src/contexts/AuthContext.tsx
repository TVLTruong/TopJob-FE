// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { jwtDecode } from 'jwt-decode'; // Import thư viện

// // 1. Định nghĩa "khuôn" của thông tin user trong JWT
// interface UserPayload {
//   sub: string; // User ID (từ NestJS)
//   email: string;
//   role: 'CANDIDATE' | 'RECRUITER';
//   iat: number; // Issued at
//   exp: number; // Expires
// }

// // 2. Định nghĩa "khuôn" của Context
// interface AuthContextType {
//   user: UserPayload | null; // Thông tin user, hoặc null nếu chưa đăng nhập
//   token: string | null;
//   login: (token: string) => void;
//   logout: () => void;
//   isLoading: boolean; // Trạng thái check đăng nhập lúc mới tải trang
// }

// // 3. Tạo Context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // 4. Tạo Provider (Component "bọc" toàn bộ ứng dụng)
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [token, setToken] = useState<string | null>(null);
//   const [user, setUser] = useState<UserPayload | null>(null);
//   const [isLoading, setIsLoading] = useState(true); // Bắt đầu ở trạng thái loading

//   useEffect(() => {
//     // Khi app mới tải, kiểm tra xem có token trong localStorage không
//     try {
//       const storedToken = localStorage.getItem('accessToken');
//       if (storedToken) {
//         const decodedUser = jwtDecode<UserPayload>(storedToken);
        
//         // Kiểm tra token còn hạn không
//         if (decodedUser.exp * 1000 > Date.now()) {
//           setToken(storedToken);
//           setUser(decodedUser);
//         } else {
//           // Token hết hạn
//           localStorage.removeItem('accessToken');
//         }
//       }
//     } catch (error) {
//       console.error("Failed to parse token from storage", error);
//       localStorage.removeItem('accessToken');
//     }
//     setIsLoading(false); // Hoàn tất kiểm tra
//   }, []);

//   const login = (newToken: string) => {
//     try {
//       const decodedUser = jwtDecode<UserPayload>(newToken);
//       localStorage.setItem('accessToken', newToken);
//       setToken(newToken);
//       setUser(decodedUser);
//     } catch (error) {
//        console.error("Failed to decode token", error);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('accessToken');
//     setToken(null);
//     setUser(null);
//     // Tùy chọn: Chuyển hướng về trang chủ
//     // window.location.href = '/'; 
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // 5. Tạo Hook (để dễ dàng sử dụng)
// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface UserPayload {
  sub: string;
  email: string;
  role: 'CANDIDATE' | 'EMPLOYER';
  status?: string; // Thêm status để check redirect
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: UserPayload | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  // ✅ ĐỔI: Khởi tạo null trước
  const [user, setUser] = useState<UserPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ ĐỔI: true để đợi useEffect chạy

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      if (storedToken) {
        let decodedUser: UserPayload;
        
        try {
          // Thử decode như JWT thật trước
          decodedUser = jwtDecode<UserPayload>(storedToken);
        } catch {
          // Nếu không phải JWT, thử các format khác
          try {
            // Thử decode như base64 JSON (fake token)
            decodedUser = JSON.parse(atob(storedToken)) as UserPayload;
          } catch {
            try {
              // Thử parse trực tiếp như JSON string (fallback)
              decodedUser = JSON.parse(storedToken) as UserPayload;
            } catch {
              throw new Error('Invalid token format');
            }
          }
        }
        
        if (decodedUser.exp * 1000 > Date.now()) {
          setToken(storedToken);
          setUser(decodedUser);
          console.log('✅ Token hợp lệ, user:', decodedUser.email, 'Status:', decodedUser.status);
        } else {
          console.log('⚠️ Token hết hạn');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('userStatus');
        }
      }
    } catch (error) {
      console.error("❌ Lỗi parse token:", error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('userStatus');
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      // Check nếu là fake token (base64 JSON) hoặc JWT thật
      let decodedUser: UserPayload;
      
      try {
        // Thử decode như JWT thật trước
        decodedUser = jwtDecode<UserPayload>(newToken);
      } catch {
        // Nếu không phải JWT, thử các format khác
        try {
          // Thử decode như base64 JSON (fake token)
          decodedUser = JSON.parse(atob(newToken)) as UserPayload;
        } catch {
          try {
            // Thử parse trực tiếp như JSON string (fallback)
            decodedUser = JSON.parse(newToken) as UserPayload;
          } catch {
            console.error('Không thể decode token');
            return;
          }
        }
      }
      
      localStorage.setItem('accessToken', newToken);
      setToken(newToken);
      setUser(decodedUser);
      
      // Lưu status vào localStorage để check redirect
      if (decodedUser.status) {
        localStorage.setItem('userStatus', decodedUser.status);
      }
      
      console.log('✅ Đăng nhập thành công:', decodedUser.email, 'Status:', decodedUser.status);
    } catch (error) {
       console.error("❌ Lỗi decode token:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setToken(null);
    setUser(null);
    console.log('🔓 Đã đăng xuất');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}