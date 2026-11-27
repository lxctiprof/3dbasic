// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="01-geo3D/index.html"><strong aria-hidden="true">1.</strong> 공간정보와 3D</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="01-geo3D/1-1.html"><strong aria-hidden="true">1.1.</strong> 3차원 공간정보</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="01-geo3D/1-2.html"><strong aria-hidden="true">1.2.</strong> 3차원 모델링</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02-install/index.html"><strong aria-hidden="true">2.</strong> Blender 설치 및 활용</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02-install/2-1.html"><strong aria-hidden="true">2.1.</strong> Blender 설치</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02-install/2-2.html"><strong aria-hidden="true">2.2.</strong> 사용자 인터페이스</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02-install/2-3.html"><strong aria-hidden="true">2.3.</strong> 오브젝트 다루기</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="02-install/2-4.html"><strong aria-hidden="true">2.4.</strong> Edit Mode</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03-modeling/index.html"><strong aria-hidden="true">3.</strong> 3D 모델링</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03-modeling/3-1.html"><strong aria-hidden="true">3.1.</strong> Location과 Demension 이해하기</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="03-modeling/3-2.html"><strong aria-hidden="true">3.2.</strong> 3D 모델링</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="04-modeling-theory.html"><strong aria-hidden="true">4.</strong> 3D 모델링 이론 및 실습이론</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="quiz/3d04-quiz.html"><strong aria-hidden="true">4.1.</strong> 복습문제</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="05-animation.html"><strong aria-hidden="true">5.</strong> 애니메이션</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="06-floorplan-3d.html"><strong aria-hidden="true">6.</strong> 도면 3D</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="quiz/3d06-quiz.html"><strong aria-hidden="true">6.1.</strong> 복습문제</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="07-material-texture.html"><strong aria-hidden="true">7.</strong> 재질 &amp; texture</a></span></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="08-light.html"><strong aria-hidden="true">8.</strong> Light</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="quiz/3d08-quiz.html"><strong aria-hidden="true">8.1.</strong> 복습문제</a></span></li></ol><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="09-render.html"><strong aria-hidden="true">9.</strong> Render 실습</a></span><ol class="section"><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="quiz/3d09-quiz.html"><strong aria-hidden="true">9.1.</strong> 복습문제</a></span></li></ol><li class="chapter-item expanded "><li class="spacer"></li></li><li class="chapter-item expanded "><span class="chapter-link-wrapper"><a href="references.html">참고자료</a></span></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split('#')[0].split('?')[0];
        if (current_page.endsWith('/')) {
            current_page += 'index.html';
        }
        const links = Array.prototype.slice.call(this.querySelectorAll('a'));
        const l = links.length;
        for (let i = 0; i < l; ++i) {
            const link = links[i];
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The 'index' page is supposed to alias the first chapter in the book.
            // Check both with and without the '.html' suffix to be robust against pretty URLs
            if (link.href.replace(/\.html$/, '') === current_page.replace(/\.html$/, '')
                || i === 0
                && path_to_root === ''
                && current_page.endsWith('/index.html')) {
                link.classList.add('active');
                let parent = link.parentElement;
                while (parent) {
                    if (parent.tagName === 'LI' && parent.classList.contains('chapter-item')) {
                        parent.classList.add('expanded');
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', e => {
            if (e.target.tagName === 'A') {
                const clientRect = e.target.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                sessionStorage.setItem('sidebar-scroll-offset', clientRect.top - sidebarRect.top);
            }
        }, { passive: true });
        const sidebarScrollOffset = sessionStorage.getItem('sidebar-scroll-offset');
        sessionStorage.removeItem('sidebar-scroll-offset');
        if (sidebarScrollOffset !== null) {
            // preserve sidebar scroll position when navigating via links within sidebar
            const activeSection = this.querySelector('.active');
            if (activeSection) {
                const clientRect = activeSection.getBoundingClientRect();
                const sidebarRect = this.getBoundingClientRect();
                const currentOffset = clientRect.top - sidebarRect.top;
                this.scrollTop += currentOffset - parseFloat(sidebarScrollOffset);
            }
        } else {
            // scroll sidebar to current active section when navigating via
            // 'next/previous chapter' buttons
            const activeSection = document.querySelector('#mdbook-sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        const sidebarAnchorToggles = document.querySelectorAll('.chapter-fold-toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(el => {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define('mdbook-sidebar-scrollbox', MDBookSidebarScrollbox);

