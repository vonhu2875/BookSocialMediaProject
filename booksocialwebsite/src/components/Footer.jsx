import { BookOpen, BookPlus, Bookmark, Mail, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
	return (
		<footer className="mt-8 border-t border-slate-800 bg-slate-900/80">
			<div className="mx-auto grid max-w-7xl px-4 sm:px-6 md:grid-cols-3 lg:px-8">
				<div className="py-5 pr-0 md:pr-8">
					<Link to="/" className="flex w-fit items-center gap-3 text-slate-100 transition hover:text-white">
						<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-lg shadow-indigo-950/40">
							<BookOpen className="h-6 w-6" />
						</span>
						<span className="text-lg font-black tracking-wide">Readora</span>
					</Link>
					<p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
						Không gian đọc sách và chia sẻ cảm nhận dành cho những người yêu câu chuyện.
					</p>
				</div>

				<div className="py-5 md:px-8">
					<h2 className="text-sm font-bold text-slate-100">Kết nối với Readora</h2>
					<p className="mt-3 max-w-xs text-sm leading-6 text-slate-400">
						Khám phá sách mới, lưu lại những cuốn yêu thích và chia sẻ tác phẩm của bạn.
					</p>
					<a href="mailto:support@readora.vn" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 transition hover:text-white">
						<Mail className="h-4 w-4" />
						support@readora.vn
					</a>
				</div>

				<div className="py-5 pl-0 md:pl-8">
					<h2 className="text-sm font-bold text-slate-100">Cộng đồng Readora</h2>
					<div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm font-semibold text-slate-300">
						<Link to="/" className="flex items-center gap-2 transition hover:text-white">
							<Search className="h-4 w-4 text-indigo-400" />
							Khám phá
						</Link>
						<Link to="/users/bookshelfs" className="flex items-center gap-2 transition hover:text-white">
							<Bookmark className="h-4 w-4 text-violet-400" />
							Tủ sách
						</Link>
						<Link to="/books/create" className="flex items-center gap-2 transition hover:text-white">
							<BookPlus className="h-4 w-4 text-emerald-400" />
							Đăng sách
						</Link>
						<Link to="/profile" className="flex items-center gap-2 transition hover:text-white">
							<UserRound className="h-4 w-4 text-amber-400" />
							Cá nhân
						</Link>
					</div>
				</div>
			</div>

			<div>
				<div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-2 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
					<span>© {new Date().getFullYear()} Readora</span>
					<span>Đọc, chia sẻ và kết nối qua từng trang sách.</span>
				</div>
			</div>
		</footer>
	);
}
