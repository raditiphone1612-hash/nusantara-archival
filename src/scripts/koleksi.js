// src/scripts/test-koleksi.js

function initTestKoleksiBatik() {
    const currentPath = window.location.pathname;
    const previousPath = sessionStorage.getItem('global_prev_path') || '';
    const gridArea = document.getElementById('area-galeri-testing');

    if (gridArea) {
        if (previousPath && !previousPath.includes('/detail') && !previousPath.includes('/test') && previousPath !== currentPath) {
            let defaultState = { search: '', provinsi: 'semua', budaya: 'semua', simbolik: 'semua', warna: [], format: 'semua', rights: 'semua', language: 'semua', source: 'semua', urutan: 'default' };
            sessionStorage.setItem('koleksi_state_v2', JSON.stringify(defaultState));
            sessionStorage.setItem('sidebar_active_state_v2', 'false');
        }

        setupSuperSearchAndFilters();
    }

    sessionStorage.setItem('global_prev_path', currentPath);
}

document.addEventListener('DOMContentLoaded', initTestKoleksiBatik);
document.addEventListener('astro:page-load', initTestKoleksiBatik);


function setupSuperSearchAndFilters() {
    let defaultState = { search: '', provinsi: 'semua', budaya: 'semua', simbolik: 'semua', warna: [], format: 'semua', rights: 'semua', language: 'semua', source: 'semua', urutan: 'default' };

    let state = JSON.parse(sessionStorage.getItem('koleksi_state_v2')) || defaultState;
    let isSidebarActive = sessionStorage.getItem('sidebar_active_state_v2') === 'true';

    const cards = document.querySelectorAll('.kartu-motif-test');
    const dashboardTotal = document.getElementById('dashboard-total-motif');
    const statusText = document.getElementById('teks-status-filter');

    const searchContainer = document.getElementById('search-filter-container');
    const inputPencarian = document.getElementById('input-pencarian-batik');
    const wrapperToggleBtn = document.getElementById('wrapper-toggle-btn');
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');

    const mainLayoutContainer = document.getElementById('main-layout-container');
    const wrapperGaleri = document.getElementById('wrapper-galeri');
    const wrapperSidebar = document.getElementById('wrapper-sidebar');
    const gridArea = document.getElementById('area-galeri-testing');

    const selectSort = document.getElementById('sort-abjad');

    const urlParams = new URLSearchParams(window.location.search);
    const idAsalKain = urlParams.get('asal');
    
    // Sinkronisasi input pencarian
    if (inputPencarian) inputPencarian.value = state.search;
    if (selectSort) selectSort.value = state.urutan;

    function updateToggleVisibility() {
        if (!inputPencarian) return;
        if (inputPencarian.value.length > 0 || document.activeElement === inputPencarian || searchContainer.matches(':hover') || isSidebarActive) {
            wrapperToggleBtn.classList.remove('opacity-0', '-translate-y-3', 'pointer-events-none');
            wrapperToggleBtn.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        } else {
            wrapperToggleBtn.classList.add('opacity-0', '-translate-y-3', 'pointer-events-none');
            wrapperToggleBtn.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }
    }

    if (searchContainer) {
        searchContainer.addEventListener('mouseenter', updateToggleVisibility);
        searchContainer.addEventListener('mouseleave', updateToggleVisibility);
    }

    if (inputPencarian) {
        inputPencarian.addEventListener('focus', updateToggleVisibility);
        inputPencarian.addEventListener('blur', updateToggleVisibility);
        inputPencarian.addEventListener('input', (e) => {
            state.search = e.target.value.toLowerCase().trim();
            sessionStorage.setItem('koleksi_state_v2', JSON.stringify(state));
            updateToggleVisibility();
            runFilter();
        });
    }

    function terapkanLayoutVisualSidebar() {
        if (!mainLayoutContainer || !wrapperSidebar || !wrapperGaleri || !gridArea || !btnToggleSidebar) return;

        if (isSidebarActive) {
            mainLayoutContainer.classList.add('gap-8');
            wrapperSidebar.classList.remove('w-0', 'opacity-0', 'p-0', 'border-0', 'm-0', 'overflow-hidden');
            wrapperSidebar.classList.add('w-full', 'md:w-1/4', 'opacity-100', 'px-6', 'pt-6', 'pb-56', 'border');
            wrapperGaleri.classList.remove('w-full');
            wrapperGaleri.classList.add('md:w-3/4');
            gridArea.classList.remove('xl:grid-cols-4');
            btnToggleSidebar.classList.add('text-[#ef4444]', 'border-[#ef4444]/40');

            if (document.getElementById('teks-toggle-filter')) document.getElementById('teks-toggle-filter').innerText = 'Tutup Filter Spesifik';
            if (document.getElementById('icon-toggle-filter')) document.getElementById('icon-toggle-filter').innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        } else {
            mainLayoutContainer.classList.remove('gap-8');
            wrapperSidebar.classList.remove('w-full', 'md:w-1/4', 'opacity-100', 'px-6', 'pt-6', 'pb-56', 'border');
            wrapperSidebar.classList.add('w-0', 'opacity-0', 'p-0', 'border-0', 'm-0', 'overflow-hidden');
            wrapperGaleri.classList.remove('md:w-3/4');
            wrapperGaleri.classList.add('w-full');
            gridArea.classList.add('xl:grid-cols-4');
            btnToggleSidebar.classList.remove('text-[#ef4444]', 'border-[#ef4444]/40');

            if (document.getElementById('teks-toggle-filter')) document.getElementById('teks-toggle-filter').innerText = 'Jelajahi Lebih Spesifik';
            if (document.getElementById('icon-toggle-filter')) document.getElementById('icon-toggle-filter').innerHTML = '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>';
        }
        updateToggleVisibility();
    }

    function paksaBukaSidebar() {
        if (isSidebarActive) return;
        isSidebarActive = true;
        sessionStorage.setItem('sidebar_active_state_v2', 'true');
        terapkanLayoutVisualSidebar();
    }

    terapkanLayoutVisualSidebar();

    if (btnToggleSidebar) {
        const newBtnToggle = btnToggleSidebar.cloneNode(true);
        btnToggleSidebar.replaceWith(newBtnToggle);
        newBtnToggle.addEventListener('click', () => {
            isSidebarActive = !isSidebarActive;
            sessionStorage.setItem('sidebar_active_state_v2', isSidebarActive ? 'true' : 'false');

            if (!isSidebarActive) {
                state.provinsi = 'semua';
                state.budaya = 'semua';
                state.simbolik = 'semua';
                state.warna = [];
                state.format = 'semua';
                state.rights = 'semua';
                state.language = 'semua';
                state.source = 'semua';
                sessionStorage.setItem('koleksi_state_v2', JSON.stringify(state));
            }

            terapkanLayoutVisualSidebar();
            runFilter();
        });
    }

    // Arsip Teknis Toggle Logic
    const btnToggleArsip = document.getElementById('btn-toggle-arsip-teknis');
    const wadahArsip = document.getElementById('wadah-arsip-teknis');
    const iconArsip = document.getElementById('icon-arsip-teknis');
    
    if (btnToggleArsip && wadahArsip && iconArsip) {
        let isArsipTerbuka = sessionStorage.getItem('arsip_teknis_state') === 'true';
        
        function updateVisualArsip() {
            if (isArsipTerbuka) {
                wadahArsip.classList.remove('hidden');
                wadahArsip.classList.add('flex');
                iconArsip.innerText = '-';
            } else {
                wadahArsip.classList.remove('flex');
                wadahArsip.classList.add('hidden');
                iconArsip.innerText = '+';
            }
        }
        
        updateVisualArsip();
        
        const newBtnArsip = btnToggleArsip.cloneNode(true);
        btnToggleArsip.replaceWith(newBtnArsip);
        newBtnArsip.addEventListener('click', () => {
            isArsipTerbuka = !isArsipTerbuka;
            sessionStorage.setItem('arsip_teknis_state', isArsipTerbuka ? 'true' : 'false');
            const curIconArsip = document.getElementById('icon-arsip-teknis');
            if (isArsipTerbuka) {
                wadahArsip.classList.remove('hidden');
                wadahArsip.classList.add('flex');
                if(curIconArsip) curIconArsip.innerText = '-';
            } else {
                wadahArsip.classList.remove('flex');
                wadahArsip.classList.add('hidden');
                if(curIconArsip) curIconArsip.innerText = '+';
            }
        });
    }

    // Dropdown Logic
    const triggers = document.querySelectorAll('.custom-select-trigger');
    function closeAll() {
        document.querySelectorAll('.custom-options-box').forEach(box => box.classList.add('hidden'));
        document.querySelectorAll('.panah-icon').forEach(p => p.style.transform = 'rotate(0deg)');
    }

    triggers.forEach(trigger => {
        trigger.replaceWith(trigger.cloneNode(true));
        const newTrigger = document.getElementById(trigger.id);
        if (newTrigger) {
            newTrigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const box = newTrigger.nextElementSibling;
                const isHidden = box.classList.contains('hidden');
                closeAll();
                if (isHidden) {
                    box.classList.remove('hidden');
                    newTrigger.querySelector('.panah-icon').style.transform = 'rotate(180deg)';
                }
            });
        }
    });

    document.addEventListener('click', closeAll);
    document.querySelectorAll('.custom-options-box').forEach(box => { box.addEventListener('click', e => e.stopPropagation()); });

    // Sorting Logic
    function eksekusiSortingAbjad() {
        if (!gridArea || !state.urutan) return;
        const arrayCards = Array.from(cards);

        if (state.urutan === 'default') {
            arrayCards.sort((a, b) => a.getAttribute('data-id').localeCompare(b.getAttribute('data-id')));
        } else {
            arrayCards.sort((a, b) => {
                const namaA = (a.getAttribute('data-nama') || '').toLowerCase();
                const namaB = (b.getAttribute('data-nama') || '').toLowerCase();
                if (state.urutan === 'az') return namaA.localeCompare(namaB);
                if (state.urutan === 'za') return namaB.localeCompare(namaA);
                return 0;
            });
        }
        arrayCards.forEach(card => gridArea.appendChild(card));
    }

    if (selectSort) {
        selectSort.removeEventListener('change', () => { });
        selectSort.addEventListener('change', (e) => {
            state.urutan = e.target.value;
            sessionStorage.setItem('koleksi_state_v2', JSON.stringify(state));
            eksekusiSortingAbjad();
            runFilter();
        });
    }

    // Main Filtering Logic
    function runFilter() {
        let count = 0;
        let liveCounts = { provinsi: {}, budaya: {}, simbolik: {}, warna: {}, format: {}, rights: {}, language: {}, source: {} };

        const sedangSorting = state.urutan === 'az' || state.urutan === 'za';

        if (idAsalKain && !sedangSorting) {
            const idTarget = idAsalKain.replace('test_', '').replace('detail_', '');
            const kartuAsal = document.querySelector(`.kartu-motif-test[data-id="${idTarget}"]`);
            if (kartuAsal && kartuAsal.parentElement) {
                kartuAsal.parentElement.prepend(kartuAsal);
            }
        }

        cards.forEach(card => {
            const namaKain = card.getAttribute('data-nama');
            const p = card.getAttribute('data-provinsi');
            const b = card.getAttribute('data-budaya');
            const s = card.getAttribute('data-simbolik');
            const w = card.getAttribute('data-warna');
            const f = card.getAttribute('data-format');
            const r = card.getAttribute('data-rights');
            const l = card.getAttribute('data-language');
            const o = card.getAttribute('data-source');
            const idKainSekarang = card.getAttribute('data-id') || card.id;

            const matchSearch = state.search === '' ||
                (namaKain && namaKain.includes(state.search)) ||
                (p && p.toLowerCase().includes(state.search)) ||
                (w && w.toLowerCase().includes(state.search));

            const matchP = state.provinsi === 'semua' || p === state.provinsi;
            const matchB = state.budaya === 'semua' || b === state.budaya;
            const matchS = state.simbolik === 'semua' || s === state.simbolik;
            const matchF = state.format === 'semua' || f === state.format;
            const matchR = state.rights === 'semua' || r === state.rights;
            const matchO = state.source === 'semua' || o === state.source;
            const matchL = state.language === 'semua' || (l && l.split(',').map(x=>x.trim()).includes(state.language));

            const matchW = state.warna.length === 0 || state.warna.some(color => {
                if (!w) return false;
                return w.toLowerCase().split(',').some(warnaRaw => {
                    const namaWarnaSaja = warnaRaw.split('(')[0].trim();
                    return namaWarnaSaja === color.toLowerCase();
                });
            });

            const criteria = {
                search: matchSearch,
                provinsi: matchP,
                budaya: matchB,
                simbolik: matchS,
                warna: matchW,
                format: matchF,
                rights: matchR,
                language: matchL,
                source: matchO
            };

            const isMatch = Object.values(criteria).every(Boolean);

            if (isMatch) {
                count++;
                card.style.display = 'block';
                setTimeout(() => { card.classList.remove('kartu-missing', 'kartu-hilang'); }, 10);

                const dots = card.querySelectorAll('.swatch-titik-warna');
                if (state.warna.length > 0) {
                    dots.forEach(dot => {
                        const dotName = dot.getAttribute('data-warna-nama');
                        dot.style.display = state.warna.some(c => c.toLowerCase() === dotName) ? 'block' : 'none';
                    });
                } else {
                    dots.forEach(dot => dot.style.display = 'block');
                }

                card.style.cursor = 'pointer';
                card.onclick = (e) => {
                    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.btn-kembali-cepat')) return;
                    if (idKainSekarang) {
                        const a = document.createElement('a');
                        const base = window.BASE_URL || '';
                        a.href = `${base}/detail/${idKainSekarang}`; // Redirect back to detail page
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                };

                if (idAsalKain && idKainSekarang === idAsalKain.replace('test_', '').replace('detail_', '')) {
                    if (!card.querySelector('.btn-kembali-cepat')) {
                        const btnKembali = document.createElement('div');
                        btnKembali.className = "btn-kembali-cepat absolute top-2 right-2 z-30 bg-[#a67c00] text-black text-[10px] font-extrabold px-3 py-1.5 rounded-full shadow-lg border border-black/10 hover:bg-white hover:scale-105 transition-all duration-300 cursor-pointer";
                        btnKembali.innerHTML = `<span>← Kembali ke Detail (Clear Filter)</span>`;
                        btnKembali.onclick = (e) => {
                            e.stopPropagation();
                            let defaultState = { search: '', provinsi: 'semua', budaya: 'semua', simbolik: 'semua', warna: [], format: 'semua', rights: 'semua', language: 'semua', source: 'semua', urutan: 'default' };
                            sessionStorage.setItem('koleksi_state_v2', JSON.stringify(defaultState));
                            sessionStorage.setItem('sidebar_active_state_v2', 'false');

                            const a = document.createElement('a');
                            const base = window.BASE_URL || '';
                            if (idAsalKain.startsWith('test_') || idAsalKain.startsWith('detail_')) {
                                const idTarget = idAsalKain.replace('test_', '').replace('detail_', '');
                                a.href = `${base}/detail/${idTarget}`;
                            } else {
                                a.href = `${base}/detail/${idAsalKain}`;
                            }
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                        };
                        card.classList.add('relative');
                        card.appendChild(btnKembali);
                    }
                }

                // GLOWING TITIK WARNA
                const titikWarnas = card.querySelectorAll('.swatch-titik-warna');
                if (state.warna.length === 0) {
                    titikWarnas.forEach(titik => {
                        titik.classList.remove('swatch-aktif', 'swatch-redup');
                        titik.style = `background-color: ${titik.style.backgroundColor}; display: block;`;
                    });
                } else {
                    titikWarnas.forEach(titik => {
                        const namaTitik = titik.getAttribute('data-warna-nama') || '';
                        const isColorMatch = state.warna.some(w => namaTitik === w.toLowerCase());
                        titik.style = `background-color: ${titik.style.backgroundColor}`;

                        if (isColorMatch) {
                            titik.classList.add('swatch-aktif');
                            titik.classList.remove('swatch-redup');
                            titik.style.display = 'block';
                        } else {
                            titik.classList.add('swatch-redup');
                            titik.classList.remove('swatch-aktif');
                            titik.style.display = 'none';
                        }
                    });
                }
            } else {
                card.classList.add('kartu-hilang');
                setTimeout(() => { if (card.classList.contains('kartu-hilang')) card.style.display = 'none'; }, 400);
            }

            // HITUNG DINAMIS (Hanya tambahkan jika cocok dengan SEMUA KRITERIA LAIN)
            const matchExcept = (excludeKey) => Object.entries(criteria).every(([k, v]) => k === excludeKey || v);

            if (matchExcept('provinsi') && p) liveCounts.provinsi[p] = (liveCounts.provinsi[p] || 0) + 1;
            if (matchExcept('budaya') && b) liveCounts.budaya[b] = (liveCounts.budaya[b] || 0) + 1;
            if (matchExcept('simbolik') && s) liveCounts.simbolik[s] = (liveCounts.simbolik[s] || 0) + 1;
            if (matchExcept('format') && f) liveCounts.format[f] = (liveCounts.format[f] || 0) + 1;
            if (matchExcept('rights') && r) liveCounts.rights[r] = (liveCounts.rights[r] || 0) + 1;
            if (matchExcept('source') && o) liveCounts.source[o] = (liveCounts.source[o] || 0) + 1;
            
            if (matchExcept('language') && l) {
                l.split(',').forEach(lang => {
                    const langClean = lang.trim();
                    if(langClean) liveCounts.language[langClean] = (liveCounts.language[langClean] || 0) + 1;
                });
            }

            if (matchExcept('warna')) {
                document.querySelectorAll('#opsi-warna .baris-opsi').forEach(btn => {
                    const t = btn.getAttribute('data-target');
                    if (t !== 'semua' && w) {
                        const isTargetMatch = w.toLowerCase().split(',').some(warnaRaw => {
                            const namaWarnaSaja = warnaRaw.split('(')[0].trim();
                            return namaWarnaSaja === t.toLowerCase();
                        });
                        if (isTargetMatch) {
                            liveCounts.warna[t] = (liveCounts.warna[t] || 0) + 1;
                        }
                    }
                });
            }
        });

        if (dashboardTotal) dashboardTotal.innerText = count;
        
        const isFilterActive = Object.entries(state).some(([k, v]) => {
            if(k === 'search' || k === 'urutan') return false;
            if(k === 'warna') return v.length > 0;
            return v !== 'semua';
        }) || state.search !== '';

        if (statusText) {
            if (state.search !== '') {
                statusText.innerText = `Menemukan kata kunci: "${state.search}"`; statusText.classList.add('text-[#c5a059]');
            } else {
                statusText.innerText = isFilterActive ? "Filter spesifik diterapkan" : "Menampilkan seluruh database"; statusText.classList.remove('text-[#c5a059]');
            }
        }

        ['provinsi', 'budaya', 'simbolik', 'warna', 'format', 'rights', 'language', 'source'].forEach(kategori => {
            const box = document.getElementById(`opsi-${kategori}`);
            if (!box) return;
            box.querySelectorAll('.baris-opsi').forEach(btn => {
                const target = btn.getAttribute('data-target');
                if (target === 'semua') return;
                const num = liveCounts[kategori][target] || 0;
                const labelAngka = btn.querySelector('.angka-opsi');
                if (labelAngka) labelAngka.innerText = num;
                btn.style.display = num > 0 ? 'flex' : 'none';
                if (kategori === 'warna') { if (state.warna.includes(target)) btn.classList.add('aktif'); else btn.classList.remove('aktif'); }
                else { if (state[kategori] === target) btn.classList.add('aktif'); else btn.classList.remove('aktif'); }
            });
        });

        renderAllPills();
    }

    function renderAllPills() {
        ['provinsi', 'budaya', 'simbolik', 'warna', 'format', 'rights', 'language', 'source'].forEach(kategori => {
            const container = document.getElementById(`pills-${kategori}`);
            if (!container) return;
            container.innerHTML = "";
            const createPill = (item) => {
                const pill = document.createElement('div');
                let visualHTML = `<span class="text-[11px] text-gray-200 font-medium line-clamp-1 max-w-[150px]">${item}</span>`;
                if (kategori === 'warna') {
                    const btnAsli = document.querySelector(`#opsi-warna [data-target="${item}"]`);
                    const hex = btnAsli?.getAttribute('data-hex') || '#555';
                    visualHTML = `<div class="w-3 h-3 rounded-full shadow-sm" style="background-color: ${hex}; border: 1px solid rgba(255,255,255,0.1)"></div><span class="text-[11px] text-gray-200 font-medium truncate max-w-[120px]">${item}</span>`;
                }
                pill.className = "hover-badge-alive inline-flex items-center justify-between gap-2.5 pl-3 pr-1.5 py-1.5 bg-[#1e1e1e] border border-gray-700 rounded-full shadow-sm animate-[fadeInScale_0.2s_ease] transition-colors hover:border-gray-500";
                pill.innerHTML = `<div class="flex items-center gap-2">${visualHTML}</div><button type="button" class="btn-hapus-pill flex items-center justify-center w-[18px] h-[18px] rounded-full text-gray-400 hover:bg-red-500/20 hover:text-red-500 transition-colors cursor-pointer" title="Hapus Filter"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>`;
                pill.querySelector('.btn-hapus-pill').addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (kategori === 'warna') { state.warna = state.warna.filter(i => i !== item); } else { state[kategori] = 'semua'; }
                    sessionStorage.setItem('koleksi_state_v2', JSON.stringify(state));
                    runFilter();
                });
                container.appendChild(pill);
            };
            if (kategori === 'warna') { state.warna.forEach(item => createPill(item)); }
            else { if (state[kategori] !== 'semua') createPill(state[kategori]); }
        });
    }

    document.querySelectorAll('.baris-opsi').forEach(btn => { btn.replaceWith(btn.cloneNode(true)); });
    document.querySelectorAll('.baris-opsi').forEach(btn => {
        btn.addEventListener('click', () => {
            const kategori = btn.getAttribute('data-kategori');
            const target = btn.getAttribute('data-target');
            if (kategori === 'warna') {
                if (target === 'semua') { state.warna = []; closeAll(); }
                else {
                    if (state.warna.includes(target)) { state.warna = state.warna.filter(i => i !== target); }
                    else { if (state.warna.length >= 3) { alert("Maksimal memilih 3 warna sekaligus!"); return; } state.warna.push(target); }
                }
            } else {
                state[kategori] = target; closeAll();
            }

            sessionStorage.setItem('koleksi_state_v2', JSON.stringify(state));
            runFilter();
        });
    });

    const qParams = new URLSearchParams(window.location.search);
    let adaQueryEksternal = false;
    
    ['provinsi', 'budaya', 'simbolik', 'format', 'rights', 'language', 'source'].forEach(k => {
        const q = qParams.get(k);
        if(q) { state[k] = q; adaQueryEksternal = true; }
    });
    
    const qWarna = qParams.get('warna');
    if (qWarna) {
        if (!state.warna.includes(qWarna)) state.warna.push(qWarna);
        adaQueryEksternal = true;
    }

    if (adaQueryEksternal) {
        sessionStorage.setItem('koleksi_state_v2', JSON.stringify(state));
        paksaBukaSidebar();
    }

    eksekusiSortingAbjad();
    runFilter();
}
