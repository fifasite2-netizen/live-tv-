const PremiumPromo = () => {
  return (
    // For Temporarily Hiding Promo Use 'hidden' className
    <div className=" hidden rounded-2xl bg-gradient-to-br from-[#E61944]/20 to-transparent p-6 border border-[#E61944]/10">
      <h4 className="font-bold text-lg mb-2">Premium Experience</h4>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
        Get ad-free streaming, multi-cam views, and 4K resolution for the
        entire tournament.
      </p>
      <button className="w-full rounded-xl bg-[#E61944] py-3 text-sm font-bold text-white hover:shadow-lg hover:shadow-[#E61944]/20 transition-all">
        Upgrade to Pro
      </button>
    </div>
  );
};

export default PremiumPromo;
